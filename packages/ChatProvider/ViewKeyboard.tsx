import {animatedSpringLayout} from '@/utils';
import bar from '@/utils/bar';
import {BlurView} from '@react-native-community/blur';
import React, {Component} from 'react';
import {
  Animated,
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
  onHeightChange?: (h: number) => any;
  inputToolbar?: any;
}

interface ISwapView extends IViewKeyboardProps {}

class ViewKeyboard extends Component<ISwapView> {
  animatedView: Animated.Value;
  initApp: any;
  hPre: any;
  hNow: any;
  constructor(props: ISwapView) {
    super(props);
    this.animatedView = new Animated.Value(bar.bottomHeight);
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
    animatedSpringLayout(this.animatedView, bar.bottomHeight).start();
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
