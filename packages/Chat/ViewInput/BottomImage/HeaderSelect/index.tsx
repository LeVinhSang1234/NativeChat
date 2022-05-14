import {
  IImagePickerProvider,
  IKeyboardProvider,
  ProviderChat,
} from '@/ChatProvider/Provider';
import Text from '@/lib/Text';
import {backgroundIconChat, colorDescription} from '@/utils/variables';
import React, {Component, Fragment} from 'react';
import {Animated, Pressable, StyleSheet} from 'react-native';

interface IHeaderSelectImageProps {
  animated: Animated.Value;
  toggleBottom?: (v: number) => any;
  provider: IKeyboardProvider;
  maxHeight: number;
  providerImage: IImagePickerProvider;
}

class HeaderSelect extends Component<IHeaderSelectImageProps> {
  render() {
    const {animated, provider, maxHeight, providerImage} = this.props;
    const scaleY = animated.interpolate({
      inputRange: [0, provider.keyboardHeight + 20, maxHeight],
      outputRange: [0, 0, 1],
    });
    const heightAlbum = animated.interpolate({
      inputRange: [0, provider.keyboardHeightSystem + 20, maxHeight],
      outputRange: [0, 0, 40],
    });
    return (
      <Animated.View
        style={[
          styles.viewSelectAlbum,
          styles.header,
          {transform: [{scaleY}], height: heightAlbum},
        ]}>
        <Pressable style={[styles.pressable, styles.pressCancel]}>
          <ProviderChat.Consumer>
            {({theme}) => (
              <Text style={styles.cancel}>{theme.common?.button.cancel}</Text>
            )}
          </ProviderChat.Consumer>
        </Pressable>
        <Pressable>
          <ProviderChat.Consumer>
            {({width, theme}) => (
              <Fragment>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.albumTitle,
                    styles.textCenter,
                    {width: width - 140},
                  ]}>
                  {providerImage.album?.title}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.albumDescription,
                    styles.textCenter,
                    {width: width - 140},
                  ]}>
                  {theme.textPhotos?.albumDescription}
                </Text>
              </Fragment>
            )}
          </ProviderChat.Consumer>
        </Pressable>
        <Pressable style={[styles.pressable, styles.pressAlbum]}>
          <ProviderChat.Consumer>
            {({theme}) => (
              <Text style={styles.album}>{theme.common?.button.album}</Text>
            )}
          </ProviderChat.Consumer>
        </Pressable>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  viewSelectAlbum: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    height: 30,
  },
  pressable: {
    width: 70,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressCancel: {
    paddingLeft: 10,
  },
  cancel: {color: backgroundIconChat, fontWeight: '600'},
  album: {color: backgroundIconChat, fontWeight: '600', textAlign: 'right'},
  pressAlbum: {
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  textCenter: {
    textAlign: 'center',
  },
  albumTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  albumDescription: {
    color: colorDescription,
    fontSize: 11,
    marginTop: 1,
    paddingBottom: 4,
    fontWeight: '600',
  },
});

export default HeaderSelect;
