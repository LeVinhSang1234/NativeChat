import {animatedSpringLayout} from '@/utils';
import {BlurView} from '@react-native-community/blur';
import React, {Component} from 'react';
import {
  Animated,
  KeyboardEvent,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native';
import {KeyboardListener} from '..';
import {ProviderChat} from './Provider';

const BlurAnimated: any = Animated.createAnimatedComponent(BlurView);

interface IViewKeyboardProps {
  backgroundColor?: string;
  keyboardDistance?: number;
  onLayout?: (e: LayoutChangeEvent) => any;
  onHeightChange?: (hPre: number, hNow: number) => any;
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

  shouldComponentUpdate(nProps: ISwapView) {
    const {keyboardDistance, backgroundColor} = this.props;
    return (
      backgroundColor !== nProps.backgroundColor ||
      keyboardDistance !== nProps.keyboardDistance
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

  render() {
    const {backgroundColor} = this.props;
    return (
      <ProviderChat.Consumer>
        {({width, colorScheme}) => (
          <BlurAnimated
            onLayout={this.onLayout}
            blurType={colorScheme}
            style={{height: this.animatedView, width, backgroundColor}}>
            <KeyboardListener
              onWillShow={this.onWillShow}
              onWillHide={this.onWillHide}
            />
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
