import {IProviderChat, useProviderChat} from '@/ChatProvider/Provider';
import KeyboardListener from '@/lib/KeyboardListener';
import {animatedSpringLayout, IconIon} from '@/utils';
import {backgroundIconChat} from '@/utils/variables';
import React, {Component} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import ButtonSend from './ButtonSend';
import Extension from './Extension';

const AnimatedInput = Animated.createAnimatedComponent(TextInput);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  animatedExpand: Animated.Value;
  keyboardShow: boolean;
  constructor(props: ISwapInputChatProps) {
    super(props);
    this.animatedInput = new Animated.Value(0);
    this.animatedSend = new Animated.Value(0);
    this.animatedExpand = new Animated.Value(0);
    this.keyboardShow = false;
    this.state = {value: ''};
  }

  shouldComponentUpdate(nProps: ISwapInputChatProps) {
    const {provider} = this.props;
    const {width, height, colorScheme, theme} = provider;
    const {avoidingView, inputChat} = theme;
    return (
      width !== nProps.provider.width ||
      colorScheme !== nProps.provider.colorScheme ||
      avoidingView !== nProps.provider.theme?.avoidingView ||
      inputChat !== nProps.provider.theme?.inputChat ||
      height !== nProps.provider.height
    );
  }

  handleChangeText = (v: string) => {
    Animated.timing(this.animatedSend, {
      toValue: Number(!!v),
      duration: 250,
      useNativeDriver: true,
      easing: Easing.elastic(1.4),
    }).start();
    this.setState({value: v});
  };

  handlePressIn = () => {
    if (!this.keyboardShow) {
      return;
    }
    this.onWillShowKeyboard();
  };

  onWillShowKeyboard = () => {
    this.keyboardShow = true;
    Animated.parallel([
      animatedSpringLayout(this.animatedInput, 1),
      Animated.timing(this.animatedExpand, {
        toValue: 1,
        duration: 0,
        useNativeDriver: false,
      }),
    ]).start();
  };

  onWillHideKeyboard = () => {
    this.keyboardShow = false;
    this.handleExpandClose();
  };

  handleExpandClose = () => {
    Animated.parallel([
      animatedSpringLayout(this.animatedInput, 0),
      Animated.timing(this.animatedExpand, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }),
    ]).start();
  };

  render() {
    const {value} = this.state;
    const {provider} = this.props;
    const {theme, width, colorScheme} = provider;
    const animatedWidthInput = this.animatedInput.interpolate({
      inputRange: [0, 1],
      outputRange: [width - 220, width - 110],
    });
    const animatedWidthExpand = this.animatedExpand.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 50],
    });

    return (
      <View style={[theme.avoidingView, styles.blur, {width}]}>
        <Extension animated={this.animatedInput} />
        <AnimatedPressable
          onPress={this.handleExpandClose}
          style={[
            styles.expand,
            {
              transform: [{scale: this.animatedExpand}],
              width: animatedWidthExpand,
            },
          ]}>
          <IconIon style={styles.iconExpand} name="chevron-forward" />
        </AnimatedPressable>
        <AnimatedInput
          onPressIn={this.handlePressIn}
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
        <KeyboardListener
          onWillShow={this.onWillShowKeyboard}
          onWillHide={this.onWillHideKeyboard}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  blur: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  expand: {
    height: '100%',
    width: 50,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 4,
  },
  iconExpand: {
    fontSize: 26,
    color: backgroundIconChat,
  },
});

const InputChat = React.forwardRef((props: IInputChatProps, ref: any) => {
  const value = useProviderChat();
  return <SwapInputChat {...props} provider={value} ref={ref} />;
});

export default InputChat;
