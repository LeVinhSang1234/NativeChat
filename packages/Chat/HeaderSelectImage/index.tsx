import {ProviderChat} from '@/ChatProvider/Provider';
import React, {Component} from 'react';
import {Animated, Pressable, StyleSheet, Text} from 'react-native';

interface IHeaderSelectImageProps {
  animated: Animated.Value;
  toggleBottom?: (v: number) => any;
}

class HeaderSelectImage extends Component<IHeaderSelectImageProps> {
  render() {
    const {animated, toggleBottom} = this.props;
    const scaleY = animated.interpolate({
      inputRange: [0, 0.6],
      outputRange: [0, 1],
    });
    const heightAlbum = animated.interpolate({
      inputRange: [0, 0.6],
      outputRange: [0, 40],
    });
    return (
      <ProviderChat.Consumer>
        {({theme, heightKeyboard}) => (
          <Animated.View
            style={[
              styles.viewSelectAlbum,
              theme.bottomImage?.header?.style,
              {transform: [{scaleY}], height: heightAlbum},
            ]}>
            <Pressable
              style={theme.bottomImage?.header?.button?.cancel?.pressable}
              onPress={() => toggleBottom?.(heightKeyboard)}>
              <Text style={theme.bottomImage?.header?.button?.cancel?.style}>
                {theme.bottomImage?.header?.button?.cancel?.text || 'Huỷ'}
              </Text>
            </Pressable>
            <Pressable>
              <Text>Huỷ</Text>
            </Pressable>
            <Pressable
              style={theme.bottomImage?.header?.button?.album?.pressable}>
              <Text style={theme.bottomImage?.header?.button?.album?.style}>
                {theme.bottomImage?.header?.button?.album?.text || 'Album'}
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  viewSelectAlbum: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default HeaderSelectImage;
