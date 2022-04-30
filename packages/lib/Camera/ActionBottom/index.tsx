import {useProviderChat} from '@/ChatProvider/Provider';
import bar from '@/utils/bar';
import React, {Component, Fragment} from 'react';
import {StyleSheet, Pressable, View} from 'react-native';
import ImagePreview from '../Image';

interface IProps {
  takePicture: () => any;
}

class ActionBottom extends Component<IProps & {width: number; height: number}> {
  imagePreviewCamera?: ImagePreview;

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {takePicture, width} = this.props;
    return (
      <Fragment>
        <View style={styles.previewImage}>
          <ImagePreview
            style={styles.image}
            ref={(ref: ImagePreview) => {
              this.imagePreviewCamera = ref;
            }}
          />
        </View>
        <Pressable onPress={takePicture}>
          <View style={[styles.capture, {left: width / 2 - 33}]}>
            <View style={styles.captureWhite} />
          </View>
        </Pressable>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  capture: {
    backgroundColor: 'rgba(174,174,174,0.8)',
    width: 70,
    height: 70,
    borderRadius: 50,
    zIndex: 1,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: bar.bottomHeight + 20,
  },
  captureWhite: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: '#ffffff',
  },
  previewImage: {
    width: 35,
    height: 35,
    borderRadius: 8,
    position: 'absolute',
    bottom: bar.bottomHeight + 38,
    left: 30,
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 8,
  },
});

const SwapActionBottom = React.forwardRef((props: IProps, ref: any) => {
  const value = useProviderChat();
  return <ActionBottom {...props} {...value} ref={ref} />;
});

export default SwapActionBottom;
