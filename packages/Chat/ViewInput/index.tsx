import {ProviderChat, ProviderKeyboard} from '@/ChatProvider/Provider';
import BlurView from '@/lib/BlurView';
import KeyboardListener from '@/lib/KeyboardListener';
import {debounce} from '@/utils';
import bar from '@/utils/bar';
import React, {Component} from 'react';
import {
  Keyboard,
  KeyboardEvent,
  LayoutAnimation,
  LayoutChangeEvent,
  Platform,
  View,
} from 'react-native';
import BottomImageHook, {BottomImageRef} from './BottomImage';
import InputChat from './InputChat';

interface IProps {
  colorScheme: 'light' | 'dark';
  heightScreen: number;
}

interface IState {
  height: number;
  duration: number;
  heightInput: number;
  keyboardHeightSystem: number;
  heightStartInit: number;
  isKeyboardOpen: boolean;
}

class ViewInput extends Component<IProps, IState> {
  animatedBegin?: boolean;
  keepKeyboard?: boolean;
  bottomImage?: BottomImageRef | null;
  constructor(props: IProps) {
    super(props);
    this.state = {
      height: bar.bottomHeight,
      keyboardHeightSystem: 0,
      isKeyboardOpen: false,
      duration: Platform.select({ios: 250, default: 10}),
      heightInput: 0,
      heightStartInit: 0,
    };
    this.removeBeginLayout = debounce(this.removeBeginLayout, 10);
  }

  shouldComponentUpdate(nProps: IProps, nState: IState) {
    const {
      height,
      keyboardHeightSystem,
      isKeyboardOpen,
      duration,
      heightStartInit,
    } = this.state;
    const {colorScheme, heightScreen} = this.props;
    return (
      height !== nState.height ||
      isKeyboardOpen !== nState.isKeyboardOpen ||
      heightStartInit !== nState.heightStartInit ||
      duration !== nState.duration ||
      keyboardHeightSystem !== nState.keyboardHeightSystem ||
      colorScheme !== nProps.colorScheme ||
      heightScreen !== nProps.heightScreen
    );
  }

  removeBeginLayout = () => {
    this.animatedBegin = false;
  };

  animatedLayout = (duration: number = 10) => {
    if (!this.animatedBegin) {
      this.animatedBegin = true;
      const typeAnimated = Platform.OS === 'ios' ? 'keyboard' : 'easeOut';
      LayoutAnimation.configureNext(
        LayoutAnimation.create(duration, typeAnimated, 'scaleY'),
        this.removeBeginLayout,
        this.removeBeginLayout,
      );
    }
  };

  onLayoutInput = (event: LayoutChangeEvent) => {
    this.setState({heightInput: event.nativeEvent.layout.height});
  };

  onWillShowKB = ({endCoordinates, duration}: KeyboardEvent) => {
    this.keepKeyboard = false;
    const {keyboardHeightSystem} = this.state;
    this.animatedLayout(duration);
    if (keyboardHeightSystem === 0) {
      this.setState({keyboardHeightSystem: endCoordinates.height});
    }
    this.setState({
      height: endCoordinates.height,
      isKeyboardOpen: true,
      heightStartInit: endCoordinates.height,
    });
  };

  onWillHideKB = ({duration}: KeyboardEvent) => {
    if (!this.keepKeyboard) {
      this.animatedLayout(duration);
      this.setState({height: bar.bottomHeight});
    }
    this.setState({isKeyboardOpen: false});
  };

  onDidShowKB = () => {
    this.bottomImage?.closeImageSelect?.();
  };

  openKeyboard = () => {
    const {isKeyboardOpen, keyboardHeightSystem} = this.state;
    this.keepKeyboard = true;
    if (isKeyboardOpen) {
      Keyboard.dismiss();
    } else {
      this.setState({
        height: keyboardHeightSystem || 250,
        heightStartInit: keyboardHeightSystem || 250,
      });
    }
  };

  dragKeyboard = (h: number) => {
    const {heightStartInit} = this.state;
    if (h > heightStartInit) {
      return;
    }
    this.setState({height: h});
  };

  removeKeyboard = () => {
    Keyboard.dismiss();
    this.animatedLayout();
    this.bottomImage?.closeImageSelect?.();
    this.setState({height: bar.bottomHeight});
  };

  openImageSelect = () => {
    this.bottomImage?.openImageSelect?.();
  };

  getState = () => {
    const {
      height,
      keyboardHeightSystem,
      isKeyboardOpen,
      duration,
      heightInput,
    } = this.state;
    return {
      heightKeyboard: height - bar.bottomHeight,
      isKeyboardOpen,
      duration,
      keyboardHeightSystem: keyboardHeightSystem || 250,
      heightInput,
    };
  };

  render() {
    const {
      height,
      keyboardHeightSystem,
      isKeyboardOpen,
      duration,
      heightStartInit,
    } = this.state;
    const {colorScheme, heightScreen} = this.props;
    const providerValue = {
      keyboardHeightSystem: keyboardHeightSystem || 250,
      isKeyboardOpen,
      durationKeyboard: duration,
      keyboardHeight: height,
      heightStartInit: heightStartInit,
      openKeyboard: this.openKeyboard,
      removeKeyboard: this.removeKeyboard,
      dragKeyboard: this.dragKeyboard,
    };
    return (
      <ProviderKeyboard.Provider value={providerValue}>
        <BlurView>
          <ProviderChat.Consumer>
            {provider => (
              <View onLayout={this.onLayoutInput}>
                <InputChat
                  openImageSelect={this.openImageSelect}
                  provider={provider}
                />
              </View>
            )}
          </ProviderChat.Consumer>
          <View style={{height}} />
          <KeyboardListener
            onWillShow={this.onWillShowKB}
            onWillHide={this.onWillHideKB}
            onDidShow={this.onDidShowKB}
          />
        </BlurView>
        <BottomImageHook
          heightScreen={heightScreen}
          ref={ref => (this.bottomImage = ref)}
          provider={providerValue}
          colorScheme={colorScheme}
        />
      </ProviderKeyboard.Provider>
    );
  }
}

export default ViewInput;
