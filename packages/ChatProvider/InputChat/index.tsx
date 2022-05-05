import {BlurView} from '@react-native-community/blur';
import React, {Component} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {IProviderChat, ProviderChat} from '../Provider';

class InputChat extends Component {
  render() {
    return (
      <ProviderChat.Consumer>
        {({theme, width, colorScheme}: IProviderChat) => {
          return (
            <BlurView
              blurType={colorScheme}
              style={[theme.avoidingView, styles.blur, {width}]}>
              <TextInput style={[theme.inputChat, {width}]} />
            </BlurView>
          );
        }}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  blur: {
    position: 'absolute',
    bottom: 0,
  },
});

export default InputChat;
