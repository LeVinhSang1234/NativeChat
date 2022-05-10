import ModalCamera from '@/Chat/ModalCamera';
import ViewInput from '@/Chat/ViewInput';
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  useColorScheme,
  LogBox,
  ViewStyle,
  Platform,
  UIManager,
} from 'react-native';
import {IProviderChat, ProviderChat} from './Provider';
import {ITheme, theme} from './theme';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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
  viewInput?: ViewInput | null;
  constructor(props: IPropsChatSwap) {
    super(props);
    this.state = {
      loading: true,
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      theme: {},
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

  removeKeyboard = () => {
    this.viewInput?.removeKeyboard?.();
  };

  isOpenKeyboard = () => {
    return (
      this.viewInput?.getState?.() || {
        heightKeyboard: 0,
        duration: 0,
        keyboardHeightSystem: 250,
        isKeyboardOpen: false,
        heightInput: 0,
      }
    );
  };

  render() {
    const {children, colorScheme, style} = this.props;
    const {loading, width, height, theme: themeState} = this.state;
    const type: 'landscape' | 'portrait' =
      width > height ? 'landscape' : 'portrait';
    const provider: IProviderChat = {
      width,
      height,
      toggleCamera: this.toggleCamera,
      removeKeyboard: this.removeKeyboard,
      theme: {...theme, ...themeState},
      colorScheme,
      type,
      isOpenKeyboard: this.isOpenKeyboard,
    };

    return (
      <ProviderChat.Provider value={provider}>
        <View style={[styles.view, style]} onLayout={this.handleLayout}>
          {loading ? <View style={styles.viewLoading} /> : children}
          <ViewInput
            ref={ref => (this.viewInput = ref)}
            colorScheme={colorScheme}
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
  viewLoading: {flexGrow: 1},
});

export default ChatProvider;
