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
  Platform,
  View,
} from 'react-native';
import InputChat from './InputChat';

interface IProps {}

interface IState {
  height: number;
  duration: number;
  keyboardHeightSystem: number;
  isKeyboardOpen: boolean;
}

class ViewInput extends Component<IProps, IState> {
  animatedBegin?: boolean;
  keepKeyboard?: boolean;
  constructor(props: IProps) {
    super(props);
    this.state = {
      height: bar.bottomHeight,
      keyboardHeightSystem: 250,
      isKeyboardOpen: false,
      duration: Platform.select({ios: 250, default: 10}),
    };
    this.removeBeginLayout = debounce(this.removeBeginLayout, 10);
  }

  shouldComponentUpdate(_nProps: IProps, nState: IState) {
    const {height, keyboardHeightSystem, isKeyboardOpen, duration} = this.state;
    return (
      height !== nState.height ||
      isKeyboardOpen !== nState.isKeyboardOpen ||
      duration !== nState.duration ||
      keyboardHeightSystem !== nState.keyboardHeightSystem
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

  onWillShowKB = ({endCoordinates, duration}: KeyboardEvent) => {
    this.keepKeyboard = false;
    this.animatedLayout(duration);
    this.setState({height: endCoordinates.height});
  };

  onWillHideKB = ({duration}: KeyboardEvent) => {
    if (!this.keepKeyboard) {
      this.animatedLayout(duration);
      this.setState({height: bar.bottomHeight});
    }
  };

  openKeyboard = () => {
    this.keepKeyboard = true;
    const {keyboardHeightSystem} = this.state;
    this.setState({height: keyboardHeightSystem});
  };

  removeKeyboard = () => {
    Keyboard.dismiss();
    this.setState({height: bar.bottomHeight});
  };

  render() {
    const {height, keyboardHeightSystem, isKeyboardOpen, duration} = this.state;
    return (
      <ProviderKeyboard.Provider
        value={{
          keyboardHeightSystem,
          isKeyboardOpen,
          durationKeyboard: duration,
          keyboardHeight: height,
          openKeyboard: this.openKeyboard,
          removeKeyboard: this.removeKeyboard,
        }}>
        <BlurView>
          <ProviderChat.Consumer>
            {provider => <InputChat provider={provider} />}
          </ProviderChat.Consumer>
          <View style={{height}} />
          <KeyboardListener
            onWillShow={this.onWillShowKB}
            onWillHide={this.onWillHideKB}
          />
        </BlurView>
      </ProviderKeyboard.Provider>
    );
  }
}

export default ViewInput;
