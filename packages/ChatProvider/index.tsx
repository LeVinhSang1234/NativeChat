import InputChat from '@/Chat/InputChat';
import ModalCamera from '@/Chat/ModalCamera';
import ImagePicker from '@/lib/ImagePicker';
import {backgroundIconChat, colorPlaceholder} from '@/utils/variables';
import {BlurView} from '@react-native-community/blur';
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  useColorScheme,
  LogBox,
} from 'react-native';
import {ProviderChat} from './Provider';
import {ITheme, theme} from './theme';
import ViewKeyboard from './ViewKeyboard';

LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
  'Overriding previous layout animation',
]);

export declare type IChatProviderProps = {
  keyboardDistance?: number;
  children?: any;
};

interface IState {
  loading: boolean;
  width: number;
  height: number;
  theme: ITheme;
  heightKeyboard: number;
}

interface IPropsChatSwap extends IChatProviderProps {
  colorScheme: 'light' | 'dark';
}

class SwapChatProvider extends Component<IPropsChatSwap, IState> {
  timeout?: NodeJS.Timeout;
  modalCamera?: ModalCamera | null;
  viewKeyboard?: ViewKeyboard | null;
  styleIcon: ITheme;
  imagePicker?: ImagePicker | null;
  constructor(props: IPropsChatSwap) {
    super(props);
    const styleIcon = {color: backgroundIconChat};
    this.styleIcon = {
      iconCamera: styleIcon,
      iconMic: styleIcon,
      iconImage: styleIcon,
    };
    this.state = {
      loading: true,
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      theme: this.styleIcon,
      heightKeyboard: 0,
    };
  }

  handleLayout = ({nativeEvent}: any) => {
    const {layout} = nativeEvent;
    const {height, width} = layout;
    this.setState({height, width, loading: false});
  };

  toggleCamera = (flag: boolean): void => {
    this.modalCamera?.toggleVisible?.(flag);
  };

  toggleKeyboard = (height: number) => {
    this.viewKeyboard?.toggleKeyboard?.(height);
    this.setState({heightKeyboard: height});
  };

  toggleImage = (height: number) => {
    const {theme: themeState} = this.state;
    this.imagePicker?.toggleImage?.(height);
    let newTheme = this.styleIcon;
    if (height) {
      const style = {color: colorPlaceholder};
      newTheme = {iconCamera: style, iconMic: style};
    }
    this.setState({theme: {...themeState, ...newTheme}});
  };

  render() {
    const {children, colorScheme, keyboardDistance} = this.props;
    const {
      loading,
      width,
      height,
      theme: themeState,
      heightKeyboard,
    } = this.state;
    const provider = {
      width,
      height,
      toggleCamera: this.toggleCamera,
      toggleImage: this.toggleImage,
      toggleKeyboard: this.toggleKeyboard,
      theme: {...theme, ...themeState},
      colorScheme,
      heightKeyboard,
    };
    return (
      <ProviderChat.Provider value={provider}>
        <View style={styles.view} onLayout={this.handleLayout}>
          {loading ? null : children}
          <BlurView blurType={colorScheme}>
            <InputChat />
            <ViewKeyboard
              ref={ref => {
                this.viewKeyboard = ref;
              }}
              keyboardDistance={keyboardDistance}
            />
          </BlurView>
          <ImagePicker
            ref={ref => (this.imagePicker = ref)}
            provider={provider}
          />
          <ModalCamera ref={ref => (this.modalCamera = ref)} />
        </View>
      </ProviderChat.Provider>
    );
  }
}

const ChatProvider = (props: IChatProviderProps) => {
  const colorScheme: 'light' | 'dark' = useColorScheme() || 'light';
  return <SwapChatProvider {...props} colorScheme={colorScheme} />;
};

const styles = StyleSheet.create({
  view: {flex: 1},
});

export default ChatProvider;
