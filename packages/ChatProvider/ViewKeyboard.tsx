import {animatedSpringLayout} from '@/utils';
import bar from '@/utils/bar';
import {BlurView} from '@react-native-community/blur';
import React, {Component} from 'react';
import {
  Animated,
  Keyboard,
  KeyboardEvent,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native';
import {KeyboardListener} from '..';
import InputChat from './InputChat';
import {ProviderChat} from './Provider';

const BlurAnimated: any = Animated.createAnimatedComponent(BlurView);

interface IViewKeyboardProps {
  backgroundColor?: string;
  keyboardDistance?: number;
  onLayout?: (e: LayoutChangeEvent) => any;
  onHeightChange?: (h: number, animated?: boolean) => any;
  inputToolbar?: any;
  setToggleKeyboard?: (f: any) => any;
}

interface ISwapView extends IViewKeyboardProps {}

class ViewKeyboard extends Component<ISwapView> {
  animatedView: Animated.Value | any;
  initApp: any;
  hPre: any;
  hNow: any;
  keepKeyboard: boolean;
  constructor(props: ISwapView) {
    super(props);
    const {setToggleKeyboard} = props;
    setToggleKeyboard?.(this.toggleImage);
    this.animatedView = new Animated.Value(bar.bottomHeight);
    this.keepKeyboard = false;
  }

  shouldComponentUpdate(nProps: ISwapView) {
    const {keyboardDistance, backgroundColor} = this.props;
    return (
      backgroundColor !== nProps.backgroundColor ||
      keyboardDistance !== nProps.keyboardDistance
    );
  }

  onWillShow = (event: KeyboardEvent) => {
    this.keepKeyboard = false;
    const {endCoordinates} = event;
    const {keyboardDistance = 0} = this.props;
    animatedSpringLayout(
      this.animatedView,
      endCoordinates.height - keyboardDistance,
    ).start();
  };

  onWillHide = () => {
    if (this.keepKeyboard) {
      return;
    }
    animatedSpringLayout(this.animatedView, bar.bottomHeight).start();
  };

  isKeyboardOpen = (): {isOpen: boolean; height: number} => {
    return {
      isOpen: this.animatedView._value > 34,
      height: this.animatedView._value,
    };
  };

  toggleImage = (height: number, callback?: () => any) => {
    this.keepKeyboard = !!height;
    Keyboard.dismiss();
    if (height === 0 || height < 0) {
      animatedSpringLayout(this.animatedView, bar.bottomHeight).start();
    } else {
      const {keyboardDistance = 0} = this.props;
      animatedSpringLayout(
        this.animatedView,
        height - keyboardDistance,
      ).start();
    }
    callback?.();
  };

  onLayout = (event: LayoutChangeEvent) => {
    const {nativeEvent} = event;
    const {layout} = nativeEvent;
    const {height} = layout;
    this.hPre = this.hNow;
    this.hNow = height;
    if (this.initApp) {
      this.initApp = false;
      return;
    }
    const {onHeightChange, onLayout} = this.props;
    onLayout?.(event);
    onHeightChange?.(this.hNow - this.hPre);
  };

  renderInput = () => {
    const {inputToolbar} = this.props;
    if (inputToolbar === undefined) {
      return <InputChat />;
    }
    return inputToolbar;
  };

  render() {
    const {backgroundColor} = this.props;
    return (
      <ProviderChat.Consumer>
        {({width, colorScheme}) => (
          <BlurAnimated
            blurType={colorScheme}
            style={[styles.view, {backgroundColor}]}
            onLayout={this.onLayout}>
            {this.renderInput()}
            <Animated.View style={{height: this.animatedView, width}}>
              <KeyboardListener
                onWillShow={this.onWillShow}
                onWillHide={this.onWillHide}
              />
            </Animated.View>
          </BlurAnimated>
        )}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    position: 'relative',
  },
});

export default ViewKeyboard;
