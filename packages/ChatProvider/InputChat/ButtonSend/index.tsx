import Text from '@/lib/Text';
import {IconIon} from '@/utils';
import {backgroundIconChat} from '@/utils/variables';
import React, {Component} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

interface ISendProps {
  animated: Animated.Value;
}

class ButtonSend extends Component<ISendProps> {
  render() {
    const {animated} = this.props;
    const animatedIcon = animated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    const animatedIconRotate = animated.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '30deg'],
    });

    return (
      <View style={styles.buttonSend}>
        <Animated.View
          style={[
            styles.viewIcon,
            {
              transform: [{scale: animatedIcon}, {rotate: animatedIconRotate}],
              opacity: animatedIcon,
            },
          ]}>
          <Text style={[styles.image, styles.icon]}>😍</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.viewIcon,
            {transform: [{scale: animated}], opacity: animated},
          ]}>
          <IconIon name="send" style={styles.image} />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonSend: {
    width: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    fontSize: 30,
    color: backgroundIconChat,
  },
  viewIcon: {
    position: 'absolute',
  },
  icon: {
    fontSize: 28,
  },
});

export default ButtonSend;
