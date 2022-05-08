import SvgXml from '@/lib/SvgXml';
import {backgroundIconChat} from '@/utils/variables';
import React, {Component} from 'react';
import {Animated, Easing, Pressable, StyleSheet} from 'react-native';
import IconSvg from './send.svg';
import IconLike from './like.svg';

const SvgAnimated = Animated.createAnimatedComponent(SvgXml);

interface IProps {
  onSend: () => any;
}

class ButtonSend extends Component<IProps> {
  animated: Animated.Value;
  constructor(props: IProps) {
    super(props);
    this.animated = new Animated.Value(0);
  }

  shouldComponentUpdate() {
    return false;
  }

  handleAnimated = (toValue: 0 | 1) => {
    Animated.timing(this.animated, {
      toValue,
      useNativeDriver: false,
      duration: 250,
      easing: Easing.elastic(1.4),
    }).start();
  };

  render() {
    const {onSend} = this.props;
    const animatedIconLike = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
    const rotateIconLike = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '30deg'],
    });

    return (
      <Pressable style={styles.view} onPress={onSend}>
        <SvgAnimated
          fill={backgroundIconChat}
          style={[
            styles.icon,
            {transform: [{scale: this.animated}], opacity: this.animated},
          ]}
          width={27}
          height={27}
          xml={IconSvg}
        />
        <SvgAnimated
          fill={backgroundIconChat}
          style={[
            styles.icon,
            styles.iconLike,
            {
              transform: [{scale: animatedIconLike}, {rotate: rotateIconLike}],
              opacity: animatedIconLike,
            },
          ]}
          width={35}
          height={35}
          xml={IconLike}
        />
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    width: 50,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingRight: 5,
    position: 'relative',
    paddingVertical: 6,
  },
  iconLike: {
    bottom: 3,
  },
  icon: {
    position: 'absolute',
    fontSize: 27,
    bottom: 4,
  },
});

export default ButtonSend;
