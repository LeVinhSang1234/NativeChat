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
import BottomImage from './BottomImage';
import InputChat from './InputChat';

interface IProps {
  colorScheme: 'light' | 'dark';
}

interface IState {
  height: number;
  duration: number;
  heightInput: number;
  keyboardHeightSystem: number;
  isKeyboardOpen: boolean;
}

class ViewInput extends Component<IProps, IState> {
  animatedBegin?: boolean;
  keepKeyboard?: boolean;
  bottomImage?: BottomImage | null;
  constructor(props: IProps) {
    super(props);
    this.state = {
      height: bar.bottomHeight,
      keyboardHeightSystem: 0,
      isKeyboardOpen: false,
      duration: Platform.select({ios: 250, default: 10}),
      heightInput: 0,
    };
    this.removeBeginLayout = debounce(this.removeBeginLayout, 10);
  }

  shouldComponentUpdate(nProps: IProps, nState: IState) {
    const {height, keyboardHeightSystem, isKeyboardOpen, duration} = this.state;
    const {colorScheme} = this.props;
    return (
      height !== nState.height ||
      isKeyboardOpen !== nState.isKeyboardOpen ||
      duration !== nState.duration ||
      keyboardHeightSystem !== nState.keyboardHeightSystem ||
      colorScheme !== nProps.colorScheme
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
    this.setState({height: endCoordinates.height, isKeyboardOpen: true});
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
      this.setState({height: keyboardHeightSystem || 250});
    }
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
    const {height, keyboardHeightSystem, isKeyboardOpen, duration} = this.state;
    const {colorScheme} = this.props;
    const providerValue = {
      keyboardHeightSystem: keyboardHeightSystem || 250,
      isKeyboardOpen,
      durationKeyboard: duration,
      keyboardHeight: height,
      openKeyboard: this.openKeyboard,
      removeKeyboard: this.removeKeyboard,
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
        <BottomImage
          ref={ref => (this.bottomImage = ref)}
          provider={providerValue}
          colorScheme={colorScheme}
        />
      </ProviderKeyboard.Provider>
    );
  }
}

export default ViewInput;
