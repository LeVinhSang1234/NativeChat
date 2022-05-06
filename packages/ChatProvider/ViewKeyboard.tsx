import {animatedSpringLayout} from '@/utils';
import bar from '@/utils/bar';
import {BlurView} from '@react-native-community/blur';
import React, {Component} from 'react';
import {Animated, Keyboard, KeyboardEvent, StyleSheet} from 'react-native';
import {KeyboardListener} from '..';
import {ProviderChat} from './Provider';

const BlurAnimated: any = Animated.createAnimatedComponent(BlurView);

interface IViewKeyboardProps {
  backgroundColor?: string;
  keyboardDistance?: number;
  inputToolbar?: any;
}

interface ISwapView extends IViewKeyboardProps {}

class ViewKeyboard extends Component<ISwapView> {
  animatedView: Animated.Value | any;
  initApp: any;
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

  isKeyboardOpen = (): {isOpen: boolean; height: number} => {
    return {
      isOpen: this.animatedView._value > 34,
      height: this.animatedView._value,
    };
  };

  toggleImage = (height: number, callback?: () => any) => {
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

  render() {
    const {backgroundColor} = this.props;
    return (
      <ProviderChat.Consumer>
        {({width, colorScheme}) => (
          <BlurAnimated
            blurType={colorScheme}
            style={[styles.view, {backgroundColor}]}>
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
