import KeyboardListener from '@/lib/KeyboardListener';
import {debounce} from '@/utils';
import React, {Component} from 'react';
import {
  GestureResponderEvent,
  Keyboard,
  LayoutAnimation,
  LayoutAnimationProperty,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

export declare type IBottomDragProps = {
  unsubHideKeyboardView: () => any;
  colorScheme: 'light' | 'dark';
};

interface IState {
  height: number;
  scrollEnabled: boolean;
}

class BottomDrag extends Component<IBottomDragProps, IState> {
  animatedBegin?: boolean;
  constructor(props: IBottomDragProps) {
    super(props);
    this.state = {height: 0, scrollEnabled: true};
    this.removeBeginLayout = debounce(this.removeBeginLayout, 15);
  }

  shouldComponentUpdate(nProps: IBottomDragProps, nState: IState) {
    const {height, scrollEnabled} = this.state;
    const {colorScheme} = this.props;
    return (
      height !== nState.height ||
      scrollEnabled !== nState.scrollEnabled ||
      colorScheme !== nProps.colorScheme
    );
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

  handleTouchMove = ({nativeEvent}: GestureResponderEvent) => {
    console.log(nativeEvent.pageY);
  };

  render() {
    const {children, colorScheme} = this.props;
    const {scrollEnabled, height} = this.state;
    const shadowColor = colorScheme === 'dark' ? '#fff' : '#000';
    const backgroundColor = colorScheme === 'dark' ? 'rgba(0,0,0,0.7)' : '#fff';

    return (
      <View
        removeClippedSubviews
        style={[styles.view, {height, shadowColor, backgroundColor}]}
        onTouchMove={this.handleTouchMove}>
        <Pressable onTouchMove={this.handleTouchMove} style={styles.wrapDrag}>
          <View style={styles.center}>
            <View style={[styles.lineDrag]} />
          </View>
        </Pressable>
        <ScrollView removeClippedSubviews scrollEnabled={scrollEnabled}>
          {children}
        </ScrollView>
        <KeyboardListener onDidShow={() => this.toggle(0)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.215,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  wrapDrag: {
    paddingVertical: 4,
    width: '100%',
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  lineDrag: {
    height: 5,
    marginVertical: 5,
    width: 60,
    backgroundColor: '#e3e3e3',
    borderRadius: 100,
  },
});

export default BottomDrag;
