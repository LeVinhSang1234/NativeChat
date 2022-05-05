import {BlurView} from '@react-native-community/blur';
import React, {Component} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {IProviderChat, ProviderChat} from '../Provider';

class InputChat extends Component {
  render() {
    return (
      <ProviderChat.Consumer>
        {({theme, width, colorScheme}: IProviderChat) => {
          return (
            <View style={[theme.avoidingView, styles.blur, {width}]}>
              <TextInput
                placeholder="Aa"
                placeholderTextColor={theme.inputChat?.placeholderTextColor}
                multiline
                style={[theme.inputChat?.style, theme.inputChat?.[colorScheme]]}
              />
            </View>
          );
        }}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  blur: {},
});

export default InputChat;
