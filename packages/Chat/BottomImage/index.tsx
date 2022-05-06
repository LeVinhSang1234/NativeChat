import {IProviderChat} from '@/ChatProvider/Provider';
import bar from '@/utils/bar';
import {BlurView} from '@react-native-community/blur';
import React, {Component, Fragment} from 'react';
import {
  Animated,
  Easing,
  GestureResponderEvent,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

const AnimatedBlur = Animated.createAnimatedComponent(BlurView);

interface IBottomImageProps {
  provider: IProviderChat;
}

class BottomImage extends Component<IBottomImageProps> {
  animatedHeight: Animated.Value | any;
  pageY: number;
  pageYStart: number;
  isMoveUp: boolean;
  heightKeyboard: number;
  animatedBackdrop: Animated.Value;
  constructor(props: IBottomImageProps) {
    super(props);
    this.animatedHeight = new Animated.Value(0);
    this.animatedBackdrop = new Animated.Value(0);
    this.pageYStart = 0;
    this.pageY = 0;
    this.isMoveUp = false;
    this.heightKeyboard = 0;
  }

  shouldComponentUpdate(nProps: IBottomImageProps) {
    const {provider} = this.props;
    return provider.colorScheme !== nProps.provider.colorScheme;
  }

  toggleImage = (h: number = 0) => {
    const {provider} = this.props;
    const {toggleKeyboard} = provider;
    Animated.timing(this.animatedHeight, {
      toValue: h,
      duration: 0,
      useNativeDriver: false,
    }).start();
    if (this.heightKeyboard && h <= this.heightKeyboard) {
      toggleKeyboard(h);
    }
  };

  handleTouchStart = ({nativeEvent}: GestureResponderEvent) => {
    this.pageYStart = nativeEvent.pageY;
    this.pageY = nativeEvent.pageY;
    if (this.heightKeyboard === 0) {
      this.heightKeyboard = this.animatedHeight._value;
    }
  };

  handleTouchMove = ({nativeEvent}: GestureResponderEvent) => {
    const valueChange = this.pageY - nativeEvent.pageY;
    this.isMoveUp = valueChange > 0;
    if (Math.abs(nativeEvent.pageY - this.pageYStart) > 10) {
      const {provider} = this.props;
      let opacity =
        (this.animatedHeight._value + valueChange) /
        (provider.height - bar.bottomHeight);
      if (opacity < 0.2) {
        opacity = 0;
      }
      let valueNext = this.animatedHeight._value + valueChange;
      if (valueNext > provider.height - bar.topHeight) {
        valueNext = provider.height - bar.topHeight;
      }
      if (valueNext && Math.abs(valueNext) > this.heightKeyboard) {
        this.handleAnimatedBackdrop(opacity);
      } else {
        this.handleAnimatedBackdrop(0);
      }
      this.toggleImage(valueNext);
      this.pageY = nativeEvent.pageY;
    }
  };

  handleTouchEnd = () => {
    const {provider} = this.props;
    const {height, toggleImage} = provider;
    this.pageYStart = 0;
    this.pageY = 0;
    if (this.isMoveUp) {
      if (this.animatedHeight._value < this.heightKeyboard) {
        toggleImage(this.heightKeyboard);
        this.handleAnimatedBackdrop(0.8);
      } else if (this.animatedHeight._value <= height - bar.topHeight) {
        toggleImage(height - bar.topHeight);
        this.handleAnimatedBackdrop(0.8);
      }
    } else {
      if (this.animatedHeight._value < this.heightKeyboard) {
        this.handleAnimatedBackdrop(0);
        this.heightKeyboard = 0;
        toggleImage(0);
      } else if (this.animatedHeight._value <= height - bar.topHeight) {
        toggleImage(this.heightKeyboard);
        this.handleAnimatedBackdrop(0);
        this.heightKeyboard = 0;
      }
    }
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        250,
        Platform.OS === 'ios' ? 'keyboard' : 'easeOut',
        'scaleY',
      ),
    );
  };

  handleAnimatedBackdrop = (value: number) => {
    Animated.timing(this.animatedBackdrop, {
      toValue: value,
      duration: 50,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
  };

  render() {
    const {provider} = this.props;
    const {colorScheme, height} = provider;
    const shadowColor = colorScheme === 'dark' ? '#fff' : '#000';
    const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';

    const heightBackdrop = this.animatedBackdrop.interpolate({
      inputRange: [0, 0.001],
      outputRange: [0, height],
    });

    return (
      <Fragment>
        <AnimatedBlur
          blurType="dark"
          blurAmount={100}
          style={[
            styles.viewBackdrop,
            {opacity: this.animatedBackdrop, height: heightBackdrop},
          ]}
        />
        <Animated.View
          style={[
            styles.view,
            {shadowColor, backgroundColor, height: this.animatedHeight},
          ]}>
          <Pressable
            onPressIn={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
            onTouchEnd={this.handleTouchEnd}
            style={styles.wrapDrag}>
            <View style={[styles.lineDrag]} />
          </Pressable>
        </Animated.View>
      </Fragment>
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
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  wrapDrag: {
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  lineDrag: {
    height: 5,
    marginVertical: 5,
    width: 60,
    backgroundColor: '#e3e3e3',
    borderRadius: 100,
  },
  viewBackdrop: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#000',
    width: '100%',
  },
});

export default BottomImage;
