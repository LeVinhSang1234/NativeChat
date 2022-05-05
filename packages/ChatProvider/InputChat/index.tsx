import {animatedTiming} from '@/utils';
import React, {Component, ForwardedRef, RefAttributes} from 'react';
import {Animated, Easing, StyleSheet, TextInput, View} from 'react-native';
import {IProviderChat, useProviderChat} from '../Provider';
import ButtonSend from './ButtonSend';
import Extension from './Extension';

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

interface IInputChatProps {}

interface ISwapInputChatProps extends IInputChatProps {
  provider: IProviderChat;
}

interface IState {
  value: string;
}

class SwapInputChat extends Component<ISwapInputChatProps, IState> {
  animatedInput: Animated.Value;
  animatedSend: Animated.Value;
  constructor(props: ISwapInputChatProps) {
    super(props);
    const {provider} = props;
    this.animatedInput = new Animated.Value(0);
    this.animatedSend = new Animated.Value(0);
    this.state = {value: ''};
  }

  shouldComponentUpdate(nProps: ISwapInputChatProps) {
    const {provider} = this.props;
    return provider !== nProps.provider;
  }

  handleChangeText = (v: string) => {
    animatedTiming(this.animatedSend, {
      toValue: Number(!!v),
      duration: 250,
      nativeDrive: true,
      easing: Easing.elastic(1.4),
    }).start();
    this.setState({value: v});
  };

  render() {
    const {value} = this.state;
    const {provider} = this.props;
    const {theme, width, colorScheme} = provider;

    const animatedWidthInput = this.animatedInput.interpolate({
      inputRange: [0, 1],
      outputRange: [width - 220, width - 130],
    });

    return (
      <View style={[theme.avoidingView, styles.blur, {width}]}>
        <Extension animated={this.animatedInput} />
        <AnimatedInput
          onChangeText={this.handleChangeText}
          placeholder="Aa"
          placeholderTextColor={theme.inputChat?.placeholderTextColor}
          multiline
          style={[
            theme.inputChat?.style,
            theme.inputChat?.[colorScheme],
            {width: animatedWidthInput},
          ]}>
          {value}
        </AnimatedInput>
        <ButtonSend animated={this.animatedSend} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  blur: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

const InputChat = React.forwardRef((props: IInputChatProps, ref: any) => {
  const value = useProviderChat();
  return <SwapInputChat {...props} provider={value} ref={ref} />;
});

export default InputChat;
