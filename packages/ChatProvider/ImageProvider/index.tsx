import {RNPhotosFramework} from '@/utils';
import React, {Component} from 'react';
import {Linking} from 'react-native';
import {
  IImagePickerProvider,
  IStatusPhotos,
  ProviderImagePicker,
} from '../Provider';

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

export declare type IAlbum = {
  getAssets: (v: any) => any;
  onChange: (v?: any) => any;
  stopTracking: (v?: any) => any;
  assetCount: number;
  localIdentifier: string;
  previewAsset: {
    _assetObj: object;
    collectionIndex: number;
    height: number;
    localIdentifier: string;
    mediaType: string;
    width: number;
  };
  title: string;
};

interface IState {
  status: IStatusPhotos;
  albums: IAlbum[];
  album?: IAlbum;
  photos: any[];
  resultAbums: any;
  waitStatus: boolean;
  reupdate: boolean;
}

class ImageProvider extends Component<IProps, IState> {
  resultAlbumTracking?: undefined;
  unsubscribeFuncAlbum: any;
  unsubscribeFuncPhotos?: any;
  constructor(props: IProps) {
    super(props);
    this.state = {
      albums: [],
      photos: [],
      resultAbums: undefined,
      album: undefined,
      status: {isAuthorized: false, status: 'notDetermined'},
      waitStatus: true,
      reupdate: false,
    };
    this.resultAlbumTracking = undefined;
  }

  async UNSAFE_componentWillMount() {
    const {reupdate} = this.state;
    const status = await RNPhotosFramework.authorizationStatus();
    this.setState({status, waitStatus: false, reupdate: !reupdate});
  }

  shouldComponentUpdate(nProps: any, nState: IState) {
    const {reupdate} = this.state;
    const {children} = this.props;
    return reupdate !== nState.reupdate || children !== nProps.children;
  }

  componentWillUnmount() {
    const {resultAbums, album} = this.state;
    resultAbums?.stopTracking?.();
    this.unsubscribeFuncAlbum?.();
    album?.stopTracking?.();
    this.unsubscribeFuncPhotos?.();
  }

  requestAuthorPhotos = async (): Promise<any> => {
    const {status: statusState} = this.state;
    if (statusState.status === 'denied') {
      return Linking.openSettings();
    }
    try {
      const s: IStatusPhotos = await RNPhotosFramework.requestAuthorization();
      this.setState({status: s});
      if (s.isAuthorized) {
        this.getAlbums();
      }
      return s;
    } catch (_e) {
      return {isAuthorized: false, status: 'notDetermined'};
    }
  };

  getAlbums = async () => {
    const {albums: albumsState, album} = this.state;
    if (albumsState.length) {
      if (albumsState[0]?.title !== album?.title) {
        this.getPhotos(albumsState[0]);
      }
      return;
    }
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
    this.getPhotos(albumsSort[0]);
  };

  getPhotos = async (album: IAlbum) => {
    const {reupdate} = this.state;
    try {
      const result = await album.getAssets({
        startIndex: 0,
        endIndex: album.assetCount,
        trackInsertsAndDeletes: true,
        trackChanges: false,
      });
      this.setState({photos: result.assets, album, reupdate: !reupdate});
      this.trackingOnchangePhotos(album);
    } catch (_e) {}
  };

  trackingOnchangePhotos = (album: IAlbum) => {
    const {album: albumState} = this.state;
    albumState?.stopTracking?.();
    this.unsubscribeFuncPhotos?.();
    this.unsubscribeFuncPhotos = album.onChange((ch: any, ud: any) => {
      const {photos: PhotosState, reupdate} = this.state;
      if (ch.hasIncrementalChanges) {
        ud(PhotosState, (udAs: any[]) => {
          this.setState({photos: udAs, reupdate: !reupdate});
        });
      }
    });
  };

  trackingOnchange = (abres: any) => {
    this.unsubscribeFuncAlbum = abres.onChange((ch: any, up: any) => {
      const {reupdate} = this.state;
      if (ch.hasIncrementalChanges) {
        up((ud: any) => {
          const albumsSort = ud.sort((a: any, b: any) => {
            return sort[a.subType] - sort[b.subType];
          });
          this.setState({resultAbums: albumsSort, reupdate: !reupdate});
        });
      }
    });
  };

  render() {
    const {children} = this.props;
    const {status, waitStatus, albums, album, photos} = this.state;
    if (waitStatus) {
      return null;
    }
    const value: IImagePickerProvider = {
      requestAuthorPhotos: this.requestAuthorPhotos,
      getAlbums: this.getAlbums,
      getPhotos: this.getPhotos,
      status,
      albums,
      album,
      photos,
    };
    return (
      <ProviderImagePicker.Provider value={value}>
        {children}
      </ProviderImagePicker.Provider>
    );
  }
}

export default ImageProvider;
