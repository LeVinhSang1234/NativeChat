import {useProviderChat} from '@/ChatProvider/Provider';
import {throwException} from '@/utils';
import React, {Component, ReactNode, Suspense} from 'react';
import {GestureResponderEvent, StatusBar} from 'react-native';
import {CameraType, FlashMode, RNCamera} from 'react-native-camera';
import ActionBottom from './ActionBottom';
import ActionTop from './ActionTop';
import FocusPoint from './FocusPoint';
import TabClickHandle from './TabClickHandle';

const ImageCapture = React.lazy(() => import('./ImageCapture'));

interface ICameraProps {
  saveText?: string;
  sendText?: string;
  defaultOpen?: boolean;
}

interface IState {
  open: boolean;
  typeCamera: keyof CameraType;
  xPoint: number;
  yPoint: number;
  cameraReady: boolean;
  flashMode: keyof FlashMode;
  zoom: number;
  exposure: number;
  image: any;
}

class Camera extends Component<
  ICameraProps & {
    width: number;
    height: number;
    toggleCamera: (flag: boolean) => any;
  },
  IState
> {
  camera?: RNCamera | null;
  timeout?: NodeJS.Timeout;
  focusPoint?: FocusPoint;

  constructor(
    props: ICameraProps & {
      width: number;
      height: number;
      toggleCamera: (flag: boolean) => any;
    },
  ) {
    super(props);
    const {defaultOpen} = this.props;
    if (defaultOpen) {
      StatusBar.setHidden(true);
    }
    this.state = {
      open: !!defaultOpen,
      typeCamera: RNCamera.Constants.Type.back,
      xPoint: 0.5,
      yPoint: 0.5,
      cameraReady: false,
      flashMode: RNCamera.Constants.FlashMode.auto,
      zoom: 0,
      exposure: -1,
      image: undefined,
    };
  }

  open = () => {
    StatusBar.setHidden(true);
    this.setState({open: true});
  };

  close = () => {
    StatusBar.setHidden(false);
    const {toggleCamera} = this.props;
    toggleCamera?.(false);
    this.setState({open: false, zoom: 0, image: undefined});
  };

  handleChangeFlash = () => {
    const {flashMode} = this.state;
    let flash;
    if (flashMode === RNCamera.Constants.FlashMode.off) {
      flash = RNCamera.Constants.FlashMode.auto;
    } else if (flashMode === RNCamera.Constants.FlashMode.on) {
      flash = RNCamera.Constants.FlashMode.off;
    } else {
      flash = RNCamera.Constants.FlashMode.on;
    }
    this.setState({flashMode: flash});
  };

  handleChangeType = () => {
    const {typeCamera} = this.state;
    this.focusPoint?.handleAnimatedViewHideNow?.(() => {
      this.setState({
        typeCamera:
          typeCamera === RNCamera.Constants.Type.back
            ? RNCamera.Constants.Type.front
            : RNCamera.Constants.Type.back,
        xPoint: 0.5,
        yPoint: 0.5,
        cameraReady: false,
        exposure: -1,
      });
    });
  };

  handlePress = async ({nativeEvent}: GestureResponderEvent) => {
    const {typeCamera} = this.state;
    if (!nativeEvent || typeCamera === RNCamera.Constants.Type.front) {
      return;
    }
    const {pageX, pageY} = nativeEvent;
    const {width, height} = this.props;
    this.setState(
      {
        exposure: -1,
        xPoint: pageY / height,
        yPoint: 1 - pageX / width,
      },
      () => {
        this.focusPoint?.handleAnimatedViewShow?.();
      },
    );
  };

  takePicture = async () => {
    if (this.camera) {
      try {
        const data = await this.camera.takePictureAsync({
          quality: 0,
          imageType: 'jpeg',
        });
        this.setState({image: data});
      } catch (e) {
        throwException(e);
      }
    }
  };

  closeImage = () => {
    this.setState({image: undefined});
  };

  renderAutoFocus = () => {
    const {typeCamera, cameraReady, xPoint, yPoint} = this.state;
    const checkFront = typeCamera === RNCamera.Constants.Type.front;
    return checkFront || !cameraReady ? undefined : {x: xPoint, y: yPoint};
  };

  handleReadyCamera = () => {
    this.setState({cameraReady: true});
  };

  handleMove = (_x: number, y: number) => {
    const {height} = this.props;
    const {exposure, typeCamera} = this.state;
    if (typeCamera === RNCamera.Constants.Type.front) {
      return;
    }
    let newEx = (exposure === -1 ? 0.5 : exposure) - y / 2 / height;
    if (newEx <= 0) {
      newEx = 0;
    } else if (newEx >= 1) {
      newEx = 1;
    }
    this.focusPoint?.handleAnimatedLineShow?.();
    this.setState({exposure: newEx});
  };

  render(): ReactNode {
    const {open, typeCamera, flashMode, zoom, exposure, image, xPoint, yPoint} =
      this.state;
    if (!open) {
      return null;
    }
    const {width, height, saveText, sendText} = this.props;
    if (image) {
      return (
        <Suspense fallback={null}>
          <ImageCapture
            saveText={saveText}
            sendText={sendText}
            onClose={this.closeImage}
            image={image}
          />
        </Suspense>
      );
    }
    return (
      <TabClickHandle
        onMove={this.handleMove}
        onDoubleTab={this.handleChangeType}
        onTab={this.handlePress}>
        <RNCamera
          useNativeZoom
          exposure={exposure}
          zoom={zoom}
          autoFocus={RNCamera.Constants.AutoFocus.off}
          autoFocusPointOfInterest={this.renderAutoFocus()}
          style={{width: width, height: height}}
          ref={ref => (this.camera = ref)}
          captureAudio={false}
          type={typeCamera}
          flashMode={flashMode}
          onCameraReady={this.handleReadyCamera}
        />
        <ActionTop
          flashMode={flashMode}
          onClose={this.close}
          onChangeFlash={this.handleChangeFlash}
          onChangeType={this.handleChangeType}
        />
        <ActionBottom takePicture={this.takePicture} />
        <FocusPoint
          ref={(ref: FocusPoint) => {
            this.focusPoint = ref;
          }}
          exposure={exposure}
          xPoint={xPoint}
          yPoint={yPoint}
        />
      </TabClickHandle>
    );
  }
}

const SwapCamera = React.forwardRef((props: ICameraProps, ref: any) => {
  const value = useProviderChat();
  return (
    <Camera {...props} {...value} ref={ref} toggleCamera={value.toggleCamera} />
  );
});

export default SwapCamera;
