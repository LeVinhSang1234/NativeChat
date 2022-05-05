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
  constructor(props: IBottomListImageProps) {
    super(props);
    this.previousY = undefined;
    this.isSwipeUp = false;
  }

  handleTouchMove = ({nativeEvent}: GestureResponderEvent) => {
    if (this.previousY === undefined) {
      this.previousY = nativeEvent.pageY;
      return;
    }
    const valueCalulator = this.previousY - nativeEvent.pageY;
    this.isSwipeUp = valueCalulator > 0;
    if (Math.abs(this.previousY - nativeEvent.pageY) >= 10) {
      const {animateImage, heightScreen} = this.props;
      const calc = valueCalulator > 0 ? valueCalulator - 5 : valueCalulator + 5;
      let value = animateImage._value + calc;
      if (value > heightScreen - bar.topHeight - 20) {
        value = heightScreen - bar.topHeight - 20;
      }
      animatedTiming(animateImage, {
        toValue: value,
        duration: Platform.OS !== 'android' ? 0 : 10,
      }).start();
      if (Platform.OS !== 'android') {
        LayoutAnimation.configureNext(
          LayoutAnimation.create(10, 'keyboard', 'opacity'),
        );
      }
      this.previousY = nativeEvent.pageY;
    }
  };

  handlePress = () => {
    this.previousY = undefined;
    const {getHeightImage, animateImage, heightScreen} = this.props;
    const initHeight = getHeightImage();
    if (this.isSwipeUp) {
      if (animateImage._value > initHeight) {
        animatedSpringLayout(
          animateImage,
          heightScreen - bar.topHeight - 20,
        ).start();
      }
    } else {
      if (animateImage._value < heightScreen - bar.topHeight - 60) {
        if (animateImage._value < initHeight / 2) {
          animatedSpringLayout(animateImage, 0).start();
        } else {
          animatedSpringLayout(animateImage, initHeight).start();
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
    const {animateImage} = this.props;
    return (
      <ProviderChat.Consumer>
        {({colorScheme}) => {
          const shadowColor = colorScheme === 'dark' ? '#fff' : '#000';
          const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';
          return (
            <Fragment>
              <Animated.View style={[styles.viewBackdrop]} />
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
                  onTouchEnd={this.handlePress}
                  onTouchMove={this.handleTouchMove}
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
  viewBackdrop: {},
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
