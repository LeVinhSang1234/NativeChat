import {IconIon} from '@/utils';
import React, {Component} from 'react';
import {Animated, Pressable, StyleSheet} from 'react-native';
import {ProviderChat} from './Provider';

interface IExtensionProps {
  color?: string;
  animatedExtendsion: Animated.Value;
}

class Extension extends Component<IExtensionProps> {
  shouldComponentUpdate(nProps: IExtensionProps) {
    const {color} = this.props;
    return color !== nProps.color;
  }

  render() {
    const {animatedExtendsion, color} = this.props;
    const translateX = animatedExtendsion.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -118],
    });
    return (
      <ProviderChat.Consumer>
        {({toggleCamera}) => (
          <Animated.View
            style={[styles.extendsion, {transform: [{translateX}]}]}>
            <Pressable onPress={() => toggleCamera(true)}>
              <IconIon name="camera" style={[styles.iconCamera, {color}]} />
            </Pressable>
            <Pressable>
              <IconIon name="image" style={[styles.iconImage, {color}]} />
            </Pressable>
            <Pressable>
              <IconIon name="mic" style={[styles.iconMic, {color}]} />
            </Pressable>
          </Animated.View>
        )}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  iconCamera: {
    fontSize: 28,
  },
  iconImage: {
    fontSize: 25,
  },
  iconMic: {
    fontSize: 25,
    marginRight: 10,
  },

  extendsion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 35,
    width: 118,
  },
});

export default Extension;
