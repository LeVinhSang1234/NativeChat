import {RNPhotosFramework} from '@/utils';
import React, {Component} from 'react';
import {IStatusPhotos, ProviderImagePicker} from '../Provider';

const sort: any = {
  smartAlbumUserLibrary: 0,
  smartAlbumFavorites: 1,
  smartAlbumVideos: 2,
  smartAlbumSelfPortraits: 3,
  smartAlbumPanoramas: 4,
  smartAlbumTimelapses: 5,
  smartAlbumSlomoVideos: 6,
  smartAlbumBursts: 7,
  smartAlbumScreenshots: 8,
  smartAlbumDepthEffect: 9,
};

interface IProps {}

interface IState {
  status: IStatusPhotos;
  albums: any[];
  album: any;
  resultAbums: any;
  waitStatus: boolean;
}

class ImageProvider extends Component<IProps, IState> {
  resultAlbumTracking?: undefined;
  unsubscribeFuncAlbum: any;
  constructor(props: IProps) {
    super(props);
    this.state = {
      albums: [],
      resultAbums: {albums: []},
      album: {},
      status: {isAuthorized: false, status: 'notDetermined'},
      waitStatus: true,
    };
    this.resultAlbumTracking = undefined;
  }

  async UNSAFE_componentWillMount() {
    const status = await RNPhotosFramework.authorizationStatus();
    this.setState({status, waitStatus: false});
    this.getAlbums();
  }

  componentWillUnmount() {
    const {resultAbums} = this.state;
    resultAbums.stopTracking?.();
    this.unsubscribeFuncAlbum?.();
  }

  requestAuthorPhotos = async () => {
    try {
      const status = await RNPhotosFramework.requestAuthorization();
      this.setState({status});
      return status;
    } catch (_e) {
      return {isAuthorized: false, status: 'notDetermined'};
    }
  };

  getAlbums = async () => {
    const result = await RNPhotosFramework.getAlbumsMany(
      [
        {
          type: 'smartAlbum',
          assetCount: 'exact',
          previewAssets: 1,
          fetchOptions: {
            sortDescriptors: [
              {
                key: 'title',
                ascending: true,
              },
            ],
            includeHiddenAssets: false,
            includeAllBurstAssets: false,
          },
          trackInsertsAndDeletes: true,
          trackChanges: false,
        },
        {
          type: 'album',
          previewAssets: 1,
          assetCount: 'exact',
          fetchOptions: {
            sortDescriptors: [
              {
                key: 'title',
                ascending: true,
              },
            ],
            includeHiddenAssets: false,
            includeAllBurstAssets: false,
          },
          trackInsertsAndDeletes: true,
          trackChanges: false,
        },
      ],
      true,
    );
    const albums = result.albums.filter((e: any) => e.assetCount);
    const albumsSort = albums.sort((a: any, b: any) => {
      return sort[a.subType] - sort[b.subType];
    });
    this.setState({resultAbums: result, albums: albumsSort});
  };

  trackingOnchange = (abres: any) => {
    this.unsubscribeFuncAlbum = abres.onChange((ch: any, up: any) => {
      if (ch.hasIncrementalChanges) {
        up((ud: any) => {
          const albumsSort = ud.sort((a: any, b: any) => {
            return sort[a.subType] - sort[b.subType];
          });
          this.setState({resultAbums: albumsSort});
        });
      }
    });
  };

  render() {
    const {children} = this.props;
    const {status, waitStatus} = this.state;
    if (waitStatus) {
      return null;
    }
    const value: any = {};
    return (
      <ProviderImagePicker.Provider value={{status, ...value}}>
        {children}
      </ProviderImagePicker.Provider>
    );
  }
}

export default ImageProvider;
