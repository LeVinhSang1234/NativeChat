import Text from '@/lib/Text';
import React, {Component, Fragment} from 'react';
import {Animated, StyleSheet} from 'react-native';

interface IBottomListImageProps {
  animateImage: Animated.Value;
}

class BottomListImage extends Component<IBottomListImageProps> {
  constructor(props: IBottomListImageProps) {
    super(props);
  }

  render() {
    const {animateImage} = this.props;
    return (
      <Fragment>
        <Animated.View style={[styles.viewBackdrop]} />
        <Animated.View style={[styles.viewImage, {height: animateImage}]}>
          <Text>Sang</Text>
        </Animated.View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  viewImage: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  viewBackdrop: {},
});

export default BottomListImage;
