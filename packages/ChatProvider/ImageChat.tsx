import React, {Component} from 'react';
import {Image, ImageStyle, StyleSheet, View} from 'react-native';

interface IImageChatProps {
  uri: string;
  style?: ImageStyle;
}

interface IImageChatState {
  loading: boolean;
  style: ImageStyle;
}

const max = 250;

class ImageChat extends Component<IImageChatProps, IImageChatState> {
  constructor(props: IImageChatProps) {
    super(props);
    this.state = {loading: true, style: {}};
  }

  componentWillUnmount() {
    this.setState = () => null;
  }

  async UNSAFE_componentWillMount() {
    const {uri} = this.props;
    await Image.prefetch(uri);
    Image.getSize(uri, (width, height) => {
      let style = {};
      if (width > height) {
        const scale = width / height;
        style = {width: max, height: max / scale};
      } else {
        const scale = height / width;
        style = {height: max, width: max / scale};
      }
      this.setState({loading: false, style});
    });
  }

  render() {
    const {uri, style: styleProps} = this.props;
    const {loading, style} = this.state;
    return loading ? (
      <View style={[styles.image, styleProps]} />
    ) : (
      <Image
        style={[style, styles.imageView, styleProps]}
        progressiveRenderingEnabled
        source={{uri}}
      />
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 160,
    height: 270,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
  },
  imageView: {borderRadius: 20},
});

export default ImageChat;
