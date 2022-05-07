import {IProviderChat} from '@/ChatProvider/Provider';
import bar from '@/utils/bar';
import {BlurView} from '@react-native-community/blur';
import React, {Component, Fragment} from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
  Animated,
  Easing,
  GestureResponderEvent,
  LayoutAnimation,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const AnimatedBlur = Animated.createAnimatedComponent(BlurView);

export declare type IBottomImageProps = {
  provider: IProviderChat;
  Header?: any;
};

interface IState {
  scrollEventThrottle: number;
}

class BottomDrag extends Component<IBottomImageProps, IState> {
  animatedHeight: Animated.Value | any;
  pageY: number;
  pageYStart: number;
  isMoveUp: boolean;
  heightKeyboard: number;
  animatedBackdrop: Animated.Value;
  startMove?: number;
  scrollView?: ScrollView | null;
  constructor(props: IBottomImageProps) {
    super(props);
    this.animatedHeight = new Animated.Value(0);
    this.animatedBackdrop = new Animated.Value(0);
    this.pageYStart = 0;
    this.pageY = 0;
    this.isMoveUp = false;
    this.startMove = undefined;
    this.heightKeyboard = 0;
    this.state = {scrollEventThrottle: 2000};
  }

  shouldComponentUpdate(nProps: IBottomImageProps) {
    const {provider, Header} = this.props;
    const {theme} = provider;
    return (
      provider.colorScheme !== nProps.provider.colorScheme ||
      theme.bottomImage?.header !== nProps.provider.theme.bottomImage?.header ||
      Header !== nProps.Header
    );
  }

  toggleImage = (h: number = 0) => {
    Animated.timing(this.animatedHeight, {
      toValue: h,
      duration: 0,
      useNativeDriver: false,
    }).start();
  };

  handleTouchStart = ({nativeEvent}: GestureResponderEvent) => {
    this.pageYStart = nativeEvent.pageY;
    this.pageY = nativeEvent.pageY;
    if (this.heightKeyboard === 0) {
      this.heightKeyboard = this.animatedHeight._value;
    }
  };

  handleTouchMove = ({nativeEvent}: GestureResponderEvent) => {
    if (this.pageYStart <= 0) {
      return;
    }
    const valueChange = this.pageY - nativeEvent.pageY;
    this.isMoveUp = valueChange >= 0;
    if (Math.abs(nativeEvent.pageY - this.pageYStart) > 10) {
      const {provider} = this.props;
      let opacity =
        (this.animatedHeight._value + valueChange - this.heightKeyboard) /
        provider.height;
      if (opacity < 0) {
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
      if (valueNext < this.heightKeyboard) {
        provider.toggleKeyboard(valueNext);
      }
      this.pageY = nativeEvent.pageY;
    }
  };

  handleTouchEnd = () => {
    if (this.pageYStart <= 0) {
      return;
    }
    this.pageYStart = 0;
    this.pageY = 0;
    this.handleCheckValue(!this.isMoveUp);
    this.animatedLayout();
  };

  handleCheckValue = (down: boolean) => {
    const {provider} = this.props;
    const {height, toggleImage} = provider;
    if (this.animatedHeight._value < this.heightKeyboard) {
      toggleImage(down ? 0 : this.heightKeyboard);
      provider.toggleKeyboard(down ? 0 : this.heightKeyboard);
      this.handleAnimatedBackdrop(0);
    } else if (this.animatedHeight._value <= height - bar.topHeight) {
      toggleImage(down ? this.heightKeyboard : height - bar.topHeight);
      if (!down) {
        ReactNativeHapticFeedback.trigger('impactHeavy', options);
      }
      this.handleAnimatedBackdrop(down ? 0 : 0.6, 100);
    }
    if (down) {
      this.heightKeyboard = 0;
    }
  };

  handleToggleClose = (v: number) => {
    const {provider} = this.props;
    const {toggleImage} = provider;
    toggleImage(v);
    this.handleAnimatedBackdrop(0);
    this.animatedLayout();
  };

  animatedLayout = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        100,
        Platform.OS === 'ios' ? 'keyboard' : 'easeOut',
        'scaleY',
      ),
    );
  };

  handleAnimatedBackdrop = (value: number, duration: number = 50) => {
    Animated.timing(this.animatedBackdrop, {
      toValue: value,
      duration,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
  };

  handleTouchMoveScroll = (event: GestureResponderEvent) => {
    if (this.startMove !== undefined) {
      if (this.pageYStart === 0) {
        this.pageYStart = event.nativeEvent.pageY;
        this.pageY = event.nativeEvent.pageY;
        this.setState({scrollEventThrottle: 16});
      }
      this.handleTouchMove(event);
      this.scrollView?.scrollTo({y: this.startMove, animated: true});
    }
  };

  handleScroll = ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (nativeEvent.contentOffset.y < 0) {
      this.startMove = 0;
      if (this.heightKeyboard === 0) {
        this.heightKeyboard = this.animatedHeight._value;
      }
    }
  };

  handleEndScroll = () => {
    this.startMove = undefined;
    this.handleTouchEnd();
    this.setState({scrollEventThrottle: 2000});
  };

  render() {
    const {provider, Header, children} = this.props;
    const {scrollEventThrottle} = this.state;
    const {colorScheme, height} = provider;
    const shadowColor = colorScheme === 'dark' ? '#fff' : '#000';
    const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';
    const heightBackdrop = this.animatedBackdrop.interpolate({
      inputRange: [0, 0.01],
      outputRange: [0, height],
    });
    const borderRadius = this.animatedBackdrop.interpolate({
      inputRange: [0, 0.6],
      outputRange: [8, 12],
    });

    return (
      <Fragment>
        <AnimatedBlur
          blurType="dark"
          blurAmount={100}
          style={[
            styles.viewBackdrop,
            {
              opacity: this.animatedBackdrop,
              height: heightBackdrop,
              backgroundColor: shadowColor,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.view,
            {
              shadowColor,
              backgroundColor,
              height: this.animatedHeight,
              borderTopRightRadius: borderRadius,
              borderTopLeftRadius: borderRadius,
            },
          ]}>
          <Pressable
            onPressIn={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
            onTouchEnd={this.handleTouchEnd}
            style={styles.wrapDrag}>
            <View style={styles.center}>
              <View style={[styles.lineDrag]} />
            </View>
            <Header
              toggleBottom={this.handleToggleClose}
              animated={this.animatedBackdrop}
            />
          </Pressable>
          <ScrollView
            ref={ref => (this.scrollView = ref)}
            scrollEventThrottle={scrollEventThrottle}
            onScroll={this.handleScroll}
            onTouchMove={this.handleTouchMoveScroll}
            onScrollEndDrag={this.handleEndScroll}>
            {children}
          </ScrollView>
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
  },
  wrapDrag: {
    paddingVertical: 4,
    textAlign: 'center',
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: '100%',
  },
});

export default BottomDrag;
