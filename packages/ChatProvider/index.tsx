import ModalCamera from '@/Chat/ModalCamera';
import {backgroundIconChat, colorPlaceholder} from '@/utils/variables';
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  useColorScheme,
  LogBox,
  ViewStyle,
} from 'react-native';
import {ProviderChat} from './Provider';
import {ITheme, theme} from './theme';
import KeyboardChat from '../Chat/KeyboardChat';

LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
  'Overriding previous layout animation with new one before',
]);

export declare type IChatProviderProps = {
  keyboardDistanceFromInput?: number;
  children?: any;
  style?: ViewStyle;
};

interface IState {
  loading: boolean;
  width: number;
  height: number;
  theme: ITheme;
}

interface IPropsChatSwap extends IChatProviderProps {
  colorScheme: 'light' | 'dark';
}

class SwapChatProvider extends Component<IPropsChatSwap, IState> {
  timeout?: NodeJS.Timeout;
  modalCamera?: ModalCamera | null;
  viewKeyboard?: KeyboardChat | null;
  styleIcon: ITheme;
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
  };

  toggleImage = (height: number) => {
    const {theme: themeState} = this.state;
    let newTheme = this.styleIcon;
    if (height) {
      const style = {color: colorPlaceholder};
      newTheme = {iconCamera: style, iconMic: style};
    }
    this.setState({theme: {...themeState, ...newTheme}});
  };

  getHeightKeyboadOpening = () => {
    return this.viewKeyboard?.state.height || 0;
  };

  render() {
    const {children, colorScheme, keyboardDistanceFromInput, style} =
      this.props;
    const {loading, width, height, theme: themeState} = this.state;
    const provider = {
      width,
      height,
      toggleCamera: this.toggleCamera,
      toggleImage: this.toggleImage,
      toggleKeyboard: this.toggleKeyboard,
      theme: {...theme, ...themeState},
      colorScheme,
      getHeightKeyboadOpening: this.getHeightKeyboadOpening,
    };

    return (
      <ProviderChat.Provider value={provider}>
        <View style={[styles.view, style]} onLayout={this.handleLayout}>
          {loading ? null : children}
          <KeyboardChat
            provider={provider}
            ref={ref => (this.viewKeyboard = ref)}
            keyboardDistanceFromInput={keyboardDistanceFromInput}
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
  view: {flexGrow: 1},
});

export default ChatProvider;
