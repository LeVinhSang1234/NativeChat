import Text from '@/lib/Text';
import {animatedSpringLayout, animatedTiming} from '@/utils';
import bar from '@/utils/bar';
import React, {Component, Fragment} from 'react';
import {
  Animated,
  GestureResponderEvent,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Vibration,
  View,
} from 'react-native';
import {ProviderChat} from '../Provider';

interface IBottomListImageProps {
  animateImage: Animated.Value | any;
  heightScreen: number;
  getHeightImage: () => any;
}

class BottomListImage extends Component<IBottomListImageProps> {
  previousY?: number;
  isSwipeUp: boolean;
  animatedBackdrop: Animated.Value;
  constructor(props: IBottomListImageProps) {
    super(props);
    this.previousY = undefined;
    this.isSwipeUp = false;
    this.animatedBackdrop = new Animated.Value(0);
  }

  handleTouchMove = (
    {nativeEvent}: GestureResponderEvent,
    toggleKeyboard: (_h: number) => any,
  ) => {
    if (this.previousY === undefined) {
      this.previousY = nativeEvent.pageY;
      return;
    }
    const valueCalulator = this.previousY - nativeEvent.pageY;
    this.isSwipeUp = valueCalulator > 0;
    if (Math.abs(this.previousY - nativeEvent.pageY) >= 10) {
      const {animateImage, heightScreen, getHeightImage} = this.props;
      const calc = valueCalulator > 0 ? valueCalulator - 5 : valueCalulator + 5;
      let value = animateImage._value + calc;
      if (value > heightScreen - bar.topHeight - 20) {
        value = heightScreen - bar.topHeight - 20;
      }
      const initHeight = getHeightImage();
      // const animatedOpacity =
      //   (heightScreen - nativeEvent.pageY) / (heightScreen - initHeight);
      if (value < initHeight) {
        toggleKeyboard?.(value);
      }
      Animated.parallel([
        animatedTiming(animateImage, {
          toValue: value,
          duration: Platform.OS !== 'android' ? 0 : 10,
        }),
        // animatedTiming(this.animatedBackdrop, {
        //   toValue: animatedOpacity,
        //   duration: Platform.OS !== 'android' ? 0 : 10,
        // }),
      ]).start();
      if (Platform.OS !== 'android') {
        LayoutAnimation.configureNext(
          LayoutAnimation.create(10, 'keyboard', 'opacity'),
        );
      }
      this.previousY = nativeEvent.pageY;
    }
  };

  handlePress = (toggleKeyboard: (_h: number) => any) => {
    this.previousY = undefined;
    const {getHeightImage, animateImage, heightScreen} = this.props;
    const initHeight = getHeightImage();
    if (this.isSwipeUp) {
      if (animateImage._value > initHeight) {
        Vibration.vibrate(100);
        animatedSpringLayout(
          animateImage,
          heightScreen - bar.topHeight - 20,
        ).start();
      }
    } else {
      if (animateImage._value < heightScreen - bar.topHeight - 60) {
        if (animateImage._value < initHeight - 10) {
          animatedSpringLayout(animateImage, 0).start();
          toggleKeyboard?.(0);
        } else {
          animatedSpringLayout(animateImage, initHeight).start();
          toggleKeyboard?.(initHeight);
        }
      } else {
        animatedSpringLayout(
          animateImage,
          heightScreen - bar.topHeight - 20,
        ).start();
      }
    }
  };

  render() {
    const {animateImage, heightScreen} = this.props;
    const heightBackdrop = this.animatedBackdrop.interpolate({
      inputRange: [0, 0.1, 1],
      outputRange: [0, heightScreen, heightScreen],
    });
    return (
      <ProviderChat.Consumer>
        {({colorScheme, toggleKeyboard}) => {
          const shadowColor = colorScheme === 'dark' ? '#fff' : '#000';
          const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';
          return (
            <Fragment>
              <Animated.View
                style={[
                  styles.viewBackdrop,
                  {height: heightBackdrop, opacity: this.animatedBackdrop},
                ]}
              />
              <Animated.View
                style={[
                  styles.viewImage,
                  {
                    height: animateImage,
                    backgroundColor,
                    shadowColor,
                  },
                ]}>
                <Pressable
                  onTouchEnd={() => this.handlePress(toggleKeyboard)}
                  onTouchMove={e => this.handleTouchMove(e, toggleKeyboard)}
                  style={styles.wrapDrag}>
                  <View style={[styles.lineDrag]} />
                </Pressable>
                <Text>Sang</Text>
              </Animated.View>
            </Fragment>
          );
        }}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  viewImage: {
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
  viewBackdrop: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#000',
    width: '100%',
  },
  wrapDrag: {
    marginVertical: 4,
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
});

export default BottomListImage;
