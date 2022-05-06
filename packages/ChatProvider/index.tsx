import BottomImage from '@/Chat/BottomImage';
import InputChat from '@/Chat/InputChat';
import ModalCamera from '@/Chat/ModalCamera';
import {BlurView} from '@react-native-community/blur';
import React, {Component} from 'react';
import {View, StyleSheet, Dimensions, useColorScheme} from 'react-native';
import {ProviderChat} from './Provider';
import {theme} from './theme';
import ViewKeyboard from './ViewKeyboard';

export declare type IChatProviderProps = {
  keyboardDistance?: number;
};

interface IState {
  loading: boolean;
  width: number;
  height: number;
}

interface IPropsChatSwap extends IChatProviderProps {
  colorScheme: 'light' | 'dark';
}

class SwapChatProvider extends Component<IPropsChatSwap, IState> {
  timeout?: NodeJS.Timeout;
  modalCamera?: ModalCamera | null;
  viewKeyboard?: ViewKeyboard | null;
  bottomImage?: BottomImage | null;
  constructor(props: IPropsChatSwap) {
    super(props);
    this.state = {
      loading: true,
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
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
    this.bottomImage?.toggleImage?.(height);
  };

  render() {
    const {children, colorScheme, keyboardDistance} = this.props;
    const {loading, width, height} = this.state;
    return (
      <ProviderChat.Provider
        value={{
          width,
          height,
          toggleCamera: this.toggleCamera,
          toggleImage: this.toggleImage,
          toggleKeyboard: this.toggleKeyboard,
          theme,
          colorScheme,
        }}>
        <View style={styles.view} onLayout={this.handleLayout}>
          {loading ? null : children}
        </View>
        <BlurView blurType={colorScheme}>
          <InputChat />
          <ViewKeyboard
            ref={ref => {
              this.viewKeyboard = ref;
            }}
            keyboardDistance={keyboardDistance}
          />
        </BlurView>
        <BottomImage ref={ref => (this.bottomImage = ref)} />
        <ModalCamera ref={ref => (this.modalCamera = ref)} />
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
