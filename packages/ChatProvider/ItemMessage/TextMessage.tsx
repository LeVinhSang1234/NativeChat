import {animatedTiming} from '@/utils';
import React, {Component} from 'react';
import {Animated, StyleSheet, Text, ViewStyle} from 'react-native';
interface IITextMessageProps {
  style?: ViewStyle | ViewStyle[];
  message: string;
  colorMessage: string;
  borderBottomLeftRadius?: number;
  borderTopLeftRadius?: number;
  borderBottomRightRadius?: number;
  borderTopRightRadius?: number;
}

class TextMessage extends Component<IITextMessageProps> {
  animatedBottomLeftRadius: Animated.Value;
  animatedTopLeftRadius: Animated.Value;
  animatedTopRightRadius: Animated.Value;
  animatedBottomRightRadius: Animated.Value;
  constructor(props: IITextMessageProps) {
    super(props);
    const {
      borderBottomLeftRadius,
      borderTopLeftRadius,
      borderBottomRightRadius,
      borderTopRightRadius,
    } = props;
    this.animatedBottomLeftRadius = new Animated.Value(
      borderBottomLeftRadius || 15,
    );
    this.animatedTopLeftRadius = new Animated.Value(borderTopLeftRadius || 15);
    this.animatedBottomRightRadius = new Animated.Value(
      borderBottomRightRadius || 15,
    );
    this.animatedTopRightRadius = new Animated.Value(
      borderTopRightRadius || 15,
    );
  }

  shouldComponentUpdate(nProps: IITextMessageProps) {
    const {style, message, colorMessage} = this.props;
    return (
      style !== nProps.style ||
      message !== nProps.message ||
      colorMessage !== nProps.colorMessage
    );
  }

  UNSAFE_componentWillReceiveProps(nProps: IITextMessageProps) {
    const {
      borderBottomLeftRadius,
      borderTopLeftRadius,
      borderBottomRightRadius,
      borderTopRightRadius,
    } = this.props;
    let animateds = [];
    if (borderBottomLeftRadius !== nProps.borderBottomLeftRadius) {
      animateds.push(
        animatedTiming(this.animatedBottomLeftRadius, {
          toValue: nProps.borderBottomLeftRadius || 15,
        }),
      );
    }
    if (borderTopLeftRadius !== nProps.borderTopLeftRadius) {
      animateds.push(
        animatedTiming(this.animatedTopLeftRadius, {
          toValue: nProps.borderTopLeftRadius || 15,
        }),
      );
    }
    if (borderTopRightRadius !== nProps.borderTopRightRadius) {
      animateds.push(
        animatedTiming(this.animatedBottomRightRadius, {
          toValue: nProps.borderTopRightRadius || 15,
        }),
      );
    }
    if (borderBottomRightRadius !== nProps.borderBottomRightRadius) {
      animateds.push(
        animatedTiming(this.animatedTopRightRadius, {
          toValue: nProps.borderBottomRightRadius || 15,
        }),
      );
    }
    if (animateds.length) {
      Animated.parallel(animateds).start();
    }
  }

  render() {
    const {style, message, colorMessage} = this.props;
    return (
      <Animated.View
        style={[
          style,
          {
            borderBottomLeftRadius: this.animatedBottomLeftRadius,
            borderTopLeftRadius: this.animatedTopLeftRadius,
            borderBottomRightRadius: this.animatedBottomRightRadius,
            borderTopRightRadius: this.animatedTopRightRadius,
          },
        ]}>
        <Text style={[styles.textMessage, {color: colorMessage}]}>
          {message}
        </Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  textMessage: {
    fontWeight: '500',
    fontSize: 14,
  },
});

export default TextMessage;
