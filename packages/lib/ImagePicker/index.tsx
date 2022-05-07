import BottomDrag from '@/Chat/BottomDrag';
import HeaderSelectImage from '@/Chat/HeaderSelectImage';
import {ImagePickerProvider, IProviderChat} from '@/ChatProvider/Provider';
import React, {Component} from 'react';
import Text from '../Text';

interface IProps {
  provider: IProviderChat;
}

class ImagePicker extends Component<IProps> {
  bottomImage: BottomDrag | null | undefined;

  toggleImage = (h?: number) => {
    this.bottomImage?.toggleImage?.(h);
  };

  render() {
    const {provider} = this.props;
    return (
      <ImagePickerProvider.Provider value={{}}>
        <BottomDrag
          Header={HeaderSelectImage}
          provider={provider}
          ref={ref => (this.bottomImage = ref)}>
          <Text style={{color: 'red'}}>Sang</Text>
        </BottomDrag>
      </ImagePickerProvider.Provider>
    );
  }
}

export default ImagePicker;
