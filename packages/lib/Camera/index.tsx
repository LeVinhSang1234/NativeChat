import {
  IProviderChat,
  ProviderChat,
  useProviderChat,
} from '@/ChatProvider/Provider';
import {IconIon, throwException} from '@/utils';
import {BlurView} from '@react-native-community/blur';
import React, {Component, ReactNode, Suspense} from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {CameraType, FlashMode, RNCamera} from 'react-native-camera';
import {Linking} from 'react-native';
import Text from '../Text';
import ActionBottom from './ActionBottom';
import ActionTop from './ActionTop';
import FocusPoint from './FocusPoint';
import TabClickHandle from './TabClickHandle';
import {backgroundIconChat, backgroundIconChatDark} from '@/utils/variables';
import bar from '@/utils/bar';

const ImageCapture = React.lazy(() => import('./ImageCapture'));

export declare type ICameraProps = {
  saveText?: string;
  sendText?: string;
  defaultOpen?: boolean;
};

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
  permission: 'READY' | 'PENDING_AUTHORIZATION' | 'NOT_AUTHORIZED';
}

class Camera extends Component<ICameraProps & IProviderChat, IState> {
  camera?: RNCamera | null;
  timeout?: NodeJS.Timeout;
  focusPoint?: FocusPoint;

  constructor(props: ICameraProps & IProviderChat) {
    super(props);
    const {defaultOpen} = this.props;
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
      permission: RNCamera.Constants.CameraStatus.READY,
    };
  }

  open = () => {
    StatusBar.setHidden(true);
    this.setState({open: true});
  };

  close = () => {
    StatusBar.setHidden(false);
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

  handleStatusCamera = async (v: any) => {
    if (v.cameraStatus === RNCamera.Constants.CameraStatus.NOT_AUTHORIZED) {
      StatusBar.setHidden(false);
    } else {
      StatusBar.setHidden(true);
    }
    this.setState({permission: v.cameraStatus});
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
    const {
      open,
      typeCamera,
      flashMode,
      zoom,
      exposure,
      image,
      xPoint,
      yPoint,
      permission,
    } = this.state;
    const {width, height, saveText, sendText, colorScheme, theme} = this.props;
    const {textLibrary} = theme;
    if (!open) {
      return null;
    }
    if (permission === RNCamera.Constants.CameraStatus.NOT_AUTHORIZED) {
      const colorIcon = colorScheme === 'light' ? '#000' : '#fff';
      const colorSetting =
        colorScheme === 'light' ? backgroundIconChat : backgroundIconChatDark;
      return (
        <ProviderChat.Consumer>
          {({toggleCamera}) => (
            <BlurView blurType={colorScheme} style={styles.blurViewAuth}>
              <Pressable
                onPress={() => {
                  this.close();
                  console.log(toggleCamera);
                  toggleCamera(false);
                }}
                style={styles.iconClose}>
                <IconIon name="ios-close" size={30} color={colorIcon} />
              </Pressable>
              <View>
                <Text style={styles.textPermission}>
                  {textLibrary?.CameraPermission}
                </Text>
                <Text style={styles.textPermissionDescription}>
                  {textLibrary?.CameraPermissionDescription}
                </Text>
                <Pressable
                  style={styles.openSetting}
                  onPress={() => Linking.openSettings()}>
                  <Text style={[styles.textOpenSeting, {color: colorSetting}]}>
                    {textLibrary?.openSettingApp}
                  </Text>
                </Pressable>
              </View>
            </BlurView>
          )}
        </ProviderChat.Consumer>
      );
    }
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
          onStatusChange={this.handleStatusCamera}
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

const styles = StyleSheet.create({
  blurViewAuth: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  textPermission: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 19,
  },
  textPermissionDescription: {
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 19,
    fontSize: 13,
    paddingHorizontal: 10,
    fontWeight: '400',
  },
  openSetting: {
    marginTop: 25,
  },
  textOpenSeting: {
    textAlign: 'center',
    fontWeight: '600',
  },
  iconClose: {
    position: 'absolute',
    top: bar.isTouch ? bar.topHeight : 10,
    left: 15,
    zIndex: 1000,
    width: 30,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2.5,
  },
});

export default SwapCamera;
