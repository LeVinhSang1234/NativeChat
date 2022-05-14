import React, {Component} from 'react';
import {Image, StyleSheet} from 'react-native';

interface IProps {
  image: any;
  widthScreen: number;
  heightScreen: number;
}

class ListImage extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
    const {image} = props;
    Image.prefetch(image.uri);
  }

  render() {
    const {image, widthScreen} = this.props;
    const widthImage = (widthScreen - 6) / 3;
    return (
      <Image
        style={[styles.image, {width: widthImage, height: widthImage}]}
        progressiveRenderingEnabled
        source={image}
      />
    );
  }
}

const styles = StyleSheet.create({
  image: {
    margin: 1,
    borderRadius: 3,
  },
});

export default ListImage;
