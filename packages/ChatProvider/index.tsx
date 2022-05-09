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
} from 'react-native';
import {ProviderChat} from './Provider';
import {ITheme, theme} from './theme';

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

  render() {
    const {children, colorScheme, style} = this.props;
    const {loading, width, height, theme: themeState} = this.state;
    const provider = {
      width,
      height,
      toggleCamera: this.toggleCamera,
      theme: {...theme, ...themeState},
      colorScheme,
    };

    return (
      <ProviderChat.Provider value={provider}>
        <View style={[styles.view, style]} onLayout={this.handleLayout}>
          {loading ? null : children}
          <ViewInput />
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
