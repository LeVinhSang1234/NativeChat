import KeyboardListener from '@/lib/KeyboardListener';
import {debounce} from '@/utils';
import React, {Component} from 'react';
import {
  Keyboard,
  LayoutAnimation,
  LayoutAnimationProperty,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

export declare type IBottomDragProps = {
  unsubHideKeyboardView: () => any;
};

interface IState {
  height: number;
}

class BottomDrag extends Component<IBottomDragProps, IState> {
  animatedBegin?: boolean;
  constructor(props: IBottomDragProps) {
    super(props);
    this.state = {height: 0};
    this.removeBeginLayout = debounce(this.removeBeginLayout, 15);
  }

  toggle = (height: number) => {
    const {unsubHideKeyboardView} = this.props;
    if (height) {
      unsubHideKeyboardView();
      Keyboard.dismiss();
    }
    this.setState({height});
  };

  removeBeginLayout = () => {
    this.animatedBegin = false;
  };

  animatedLayout = (
    duration: number = 10,
    type: LayoutAnimationProperty = 'opacity',
  ) => {
    if (!this.animatedBegin) {
      this.animatedBegin = true;
      const typeAnimated = Platform.OS === 'ios' ? 'keyboard' : 'easeOut';
      LayoutAnimation.configureNext(
        LayoutAnimation.create(duration, typeAnimated, type),
        this.removeBeginLayout,
        this.removeBeginLayout,
      );
    }
  };

  render() {
    const {children} = this.props;
    const {height} = this.state;
    return (
      <View style={[styles.view, {height}]}>
        {children}
        <KeyboardListener onDidShow={() => this.toggle(0)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    bottom: 0,
  },
});

export default BottomDrag;
