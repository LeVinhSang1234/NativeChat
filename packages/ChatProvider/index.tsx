import BottomImage from '@/Chat/BottomImage';
import InputChat from '@/Chat/InputChat';
import ModalCamera from '@/Chat/ModalCamera';
import {backgroundIconChat, colorPlaceholder} from '@/utils/variables';
import {BlurView} from '@react-native-community/blur';
import React, {Component} from 'react';
import {View, StyleSheet, Dimensions, useColorScheme} from 'react-native';
import {ProviderChat} from './Provider';
import {ITheme, theme} from './theme';
import ViewKeyboard from './ViewKeyboard';

export declare type IChatProviderProps = {
  keyboardDistance?: number;
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
  viewKeyboard?: ViewKeyboard | null;
  bottomImage?: BottomImage | null;
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
    this.bottomImage?.toggleImage?.(height);
    let newTheme = this.styleIcon;
    if (height) {
      const style = {color: colorPlaceholder};
      newTheme = {iconCamera: style, iconMic: style};
    }
    this.setState({theme: {...themeState, ...newTheme}});
  };

  render() {
    const {children, colorScheme, keyboardDistance} = this.props;
    const {loading, width, height, theme: themeState} = this.state;
    const provider = {
      width,
      height,
      toggleCamera: this.toggleCamera,
      toggleImage: this.toggleImage,
      toggleKeyboard: this.toggleKeyboard,
      theme: {...theme, ...themeState},
      colorScheme,
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
          <BottomImage
            provider={provider}
            ref={ref => (this.bottomImage = ref)}
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
