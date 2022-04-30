import {animatedSpringLayout} from '@/utils';
import React, {Component} from 'react';
import {
  Animated,
  KeyboardEvent,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native';
import {KeyboardListener} from '..';
import InputChat from './InputChat';
import {ProviderChat} from './Provider';

interface IViewKeyboardProps {
  backgroundColor?: string;
  keyboardDistance?: number;
  onLayout?: (e: LayoutChangeEvent) => any;
  onHeightChange?: (hPre: number, hNow: number) => any;
  inputToolbar: any;
}

interface ISwapView extends IViewKeyboardProps {}

class ViewKeyboard extends Component<ISwapView> {
  animatedView: Animated.Value;
  initApp: any;
  hPre: any;
  hNow: any;
  constructor(props: ISwapView) {
    super(props);
    this.animatedView = new Animated.Value(0);
  }

  shouldComponentUpdate(
    nProps: IViewKeyboardProps & {width: number; colorScheme: 'light' | 'dark'},
  ) {
    const {keyboardDistance, backgroundColor, inputToolbar} = this.props;
    return (
      backgroundColor !== nProps.backgroundColor ||
      keyboardDistance !== nProps.keyboardDistance ||
      inputToolbar !== nProps.inputToolbar
    );
  }

  onWillShow = (event: KeyboardEvent) => {
    const {endCoordinates} = event;
    const {keyboardDistance = 0} = this.props;
    animatedSpringLayout(
      this.animatedView,
      endCoordinates.height - keyboardDistance,
    ).start();
  };

  onWillHide = () => {
    animatedSpringLayout(this.animatedView, 0).start();
  };

  onLayout = (event: LayoutChangeEvent) => {
    if (this.initApp) {
      this.initApp = false;
      return;
    }
    const {nativeEvent} = event;
    const {onHeightChange, onLayout} = this.props;
    onLayout?.(event);
    this.hPre = this.hNow;
    const {layout} = nativeEvent;
    const {height} = layout;
    this.hNow = height;
    onHeightChange?.(this.hPre, this.hNow);
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
        {({width}) => (
          <View onLayout={this.onLayout}>
            <View style={[styles.blurView]}>{this.renderInput()}</View>
            <Animated.View
              style={{height: this.animatedView, width, backgroundColor}}>
              <KeyboardListener
                onWillShow={this.onWillShow}
                onWillHide={this.onWillHide}
              />
            </Animated.View>
          </View>
        )}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    position: 'relative',
  },
  blurView: {
    zIndex: 1,
    position: 'relative',
  },
});

export default ViewKeyboard;
