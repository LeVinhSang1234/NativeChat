import {IconIon, IconSomeWhere} from '@/utils';
import React, {Component} from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface IIconSendProps {
  animatedButtonSend: Animated.Value;
  color: string;
}

class IconSend extends Component<IIconSendProps> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {animatedButtonSend, color} = this.props;
    const animatedIconLike = animatedButtonSend.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
    const animatedIconLikeRotate = animatedButtonSend.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '30deg'],
    });
    return (
      <View style={styles.viewButtonSend}>
        <AnimatedPressable
          style={[
            styles.iconSendView,
            {
              transform: [{scale: animatedButtonSend}],
              opacity: animatedButtonSend,
            },
          ]}>
          <IconIon name="send" style={[styles.iconSend, {color}]} />
        </AnimatedPressable>
        <AnimatedPressable
          style={[
            styles.iconSendView,
            styles.iconSendLike,
            {
              transform: [
                {scale: animatedIconLike},
                {rotate: animatedIconLikeRotate},
              ],
              opacity: animatedIconLike,
            },
          ]}>
          <IconSomeWhere name="thumbs-up" style={[styles.iconLike, {color}]} />
        </AnimatedPressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewButtonSend: {
    width: 50,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconSend: {
    fontSize: 25,
  },
  iconSendLike: {
    paddingBottom: 4,
  },
  iconLike: {
    fontSize: 29,
  },
  iconSendView: {
    position: 'absolute',
  },
});

export default IconSend;
