import {animatedSpringLayout, animatedTiming, appConnect} from '@/utils';
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  LogBox,
  Dimensions,
  LayoutChangeEvent,
  Modal,
  useColorScheme,
  Animated,
  KeyboardEvent,
} from 'react-native';
import {Camera, KeyboardListener} from '..';
import BottomListImage from './BottomListImage';
import {ProviderChat} from './Provider';
import {theme} from './theme';

LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

export interface IChatProviderProps {}

interface IState {
  loading: boolean;
  isCamera: boolean;
  width: number;
  height: number;
}

interface IPropsChatSwap extends IChatProviderProps {
  colorScheme: 'light' | 'dark';
}

class SwapChatProvider extends Component<IPropsChatSwap, IState> {
  animateImage: Animated.Value;
  timeout?: NodeJS.Timeout;
  constructor(props: IPropsChatSwap) {
    super(props);
    this.state = {
      loading: true,
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      isCamera: false,
    };
    this.animateImage = new Animated.Value(0);
  }

  handleLayout = ({nativeEvent}: LayoutChangeEvent) => {
    const {layout} = nativeEvent;
    const {height, width} = layout;
    this.setState({height, width, loading: false});
  };

  toggleCamera = (flag: boolean): void => {
    this.setState({isCamera: flag});
  };

  toggleImage = (height: number) => {
    animatedSpringLayout(this.animateImage, height).start();
  };

  onWillShowKeyboard = ({duration}: KeyboardEvent) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
    this.timeout = setTimeout(() => {
      this.timeout = undefined;
      animatedTiming(this.animateImage, {toValue: 0, duration: 0}).start();
    }, duration);
  };

  render() {
    const {children, colorScheme} = this.props;
    const {loading, width, height, isCamera} = this.state;
    return (
      <ProviderChat.Provider
        value={{
          width,
          height,
          toggleCamera: this.toggleCamera,
          toggleImage: this.toggleImage,
          theme,
          colorScheme,
        }}>
        <View style={styles.view} onLayout={this.handleLayout}>
          {loading ? null : children}
        </View>
        <BottomListImage animateImage={this.animateImage} />
        <Modal visible={isCamera}>
          <Camera defaultOpen />
        </Modal>
        <KeyboardListener onWillShow={this.onWillShowKeyboard} />
      </ProviderChat.Provider>
    );
  }
}

const ChatProvider = (props: IChatProviderProps) => {
  const colorScheme: 'light' | 'dark' = useColorScheme() || 'light';
  return <SwapChatProvider {...props} colorScheme={colorScheme} />;
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

export {appConnect};

export default ChatProvider;
