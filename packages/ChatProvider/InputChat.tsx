import React, {Component, ReactNode, useContext} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {backgroundIconChat, backgroundInputChat} from '@/utils/variables';
import bar from '@/utils/bar';
import {
  animatedSpring,
  animatedSpringLayout,
  animatedTiming,
  IconIon,
} from '@/utils';
import {ProviderChat} from './Provider';
import {KeyboardListener} from '..';
import Extension from './Extension';
import IconSend from './IconSend';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface IInputChatProps {
  backgroundColor?: string;
  selectionColor?: string;
  disabledColor?: string;
}

interface IState {
  inputText: string;
  mutilineText: boolean;
}

interface ISwapInputChatProps extends IInputChatProps {
  width: number;
  colorScheme: 'dark' | 'light';
}

class WrapInputChat extends Component<ISwapInputChatProps, IState> {
  animated: Animated.ValueXY;
  animatedWidth: Animated.Value;
  animatedButtonSend: Animated.Value;
  animatedExtendsion: Animated.Value;
  animatedCollapseExtendsion: Animated.Value;
  keyboardShow?: boolean;
  input?: TextInput | null;
  constructor(props: ISwapInputChatProps) {
    super(props);
    const {width} = props;
    this.animatedWidth = new Animated.Value(width - 188);
    this.animatedExtendsion = new Animated.Value(0);
    this.animated = new Animated.ValueXY({x: 0, y: 0});
    this.animatedButtonSend = new Animated.Value(0);
    this.animatedCollapseExtendsion = new Animated.Value(0);
    this.state = {inputText: '', mutilineText: false};
  }

  UNSAFE_componentWillReceiveProps(nProps: ISwapInputChatProps) {
    const {width} = this.props;
    if (width !== nProps.width) {
      this.handleBlurInput(nProps);
    }
  }

  handleChangeText = (value: string) => {
    const {inputText} = this.state;
    if (!inputText && value) {
      animatedTiming(this.animatedButtonSend, {
        toValue: 1,
        duration: 250,
        easing: Easing.elastic(1.3),
        nativeDrive: true,
      }).start();
    } else if (!value && inputText) {
      animatedTiming(this.animatedButtonSend, {
        toValue: 0,
        duration: 250,
        easing: Easing.elastic(1.3),
        nativeDrive: true,
      }).start();
    }
    this.setState({inputText: value});
  };

  handleAnimatedInput = (value: number) => {
    animatedSpringLayout(this.animatedWidth, value).start();
  };

  handlePressInput = (props = this.props) => {
    if (!this.keyboardShow) {
      return;
    }
    const {width} = props;
    Animated.parallel([
      animatedSpringLayout(this.animatedExtendsion, 1),
      animatedTiming(this.animatedCollapseExtendsion, {
        toValue: 50,
        duration: 0,
      }),
      animatedSpringLayout(this.animatedWidth, width - 110),
    ]).start();
  };

  handleFocusInput = (props = this.props) => {
    const {width} = props;
    this.setState({mutilineText: true}, () => {
      this.input?.focus?.();
    });
    Animated.parallel([
      animatedSpringLayout(this.animatedExtendsion, 1),
      animatedTiming(this.animatedCollapseExtendsion, {
        toValue: 50,
        duration: 0,
      }),
      animatedSpringLayout(this.animatedWidth, width - 110),
    ]).start();
  };

  handleBlurInput = (props = this.props) => {
    const {width} = props;
    Animated.parallel([
      animatedSpringLayout(this.animatedExtendsion, 0),
      animatedTiming(this.animatedCollapseExtendsion, {
        toValue: 1,
        duration: 0,
      }),
      animatedSpringLayout(this.animatedWidth, width - 188),
    ]).start();
  };

  renderBackgroundColor = () => {
    const {backgroundColor, colorScheme} = this.props;
    if (backgroundColor) {
      return backgroundColor;
    }
    if (colorScheme === 'light') {
      return backgroundInputChat;
    }
    return '#303030';
  };

  onWillShowKeyboard = () => {
    this.keyboardShow = true;
    this.handleFocusInput();
  };

  onWillHideKeyboard = () => {
    this.keyboardShow = false;
  };

  render(): ReactNode {
    const {inputText, mutilineText} = this.state;
    const {selectionColor, width, colorScheme} = this.props;
    const colorInput = colorScheme === 'dark' ? '#fff' : '#000';
    const heightInit = mutilineText ? 'auto' : 19.5;

    return (
      <View style={[styles.view, {width}]}>
        <Extension
          animatedExtendsion={this.animatedExtendsion}
          color={selectionColor || backgroundIconChat}
        />
        <AnimatedPressable
          onPress={() => this.handleBlurInput()}
          style={[
            styles.collapseExtension,
            {width: this.animatedCollapseExtendsion},
          ]}>
          <IconIon
            name="chevron-forward"
            style={[
              styles.iconCamera,
              {color: selectionColor || backgroundIconChat},
            ]}
          />
        </AnimatedPressable>
        <AnimatedPressable
          onPress={() => this.handleFocusInput()}
          style={[
            styles.viewInput,
            {
              width: this.animatedWidth,
              backgroundColor: this.renderBackgroundColor(),
            },
          ]}>
          <TextInput
            multiline
            ref={ref => {
              this.input = ref;
            }}
            onPressIn={() => this.handlePressInput()}
            onBlur={() => this.handleBlurInput()}
            placeholder="Aa"
            style={[styles.input, {color: colorInput, height: heightInit}]}
            onChangeText={this.handleChangeText}
            selectionColor={selectionColor || backgroundIconChat}
            placeholderTextColor="#6a6a6a">
            <Text>{inputText}</Text>
          </TextInput>
        </AnimatedPressable>
        <IconSend
          animatedButtonSend={this.animatedButtonSend}
          color={selectionColor || backgroundIconChat}
        />
        <KeyboardListener
          onWillShow={this.onWillShowKeyboard}
          onWillHide={this.onWillHideKeyboard}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingRight: 0,
    paddingLeft: 12,
    paddingTop: 12,
    paddingBottom: bar.bottomHeight || 10,
  },
  viewInput: {
    borderRadius: 20,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  input: {
    width: '100%',
    paddingTop: 0,
    marginTop: 0,
    fontSize: 14,
    lineHeight: 19,
    maxHeight: 110,
  },
  iconCamera: {
    fontSize: 28,
  },
  contentExtendsion: {
    flexDirection: 'row',
  },
  collapseExtension: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const InputChat = (props: IInputChatProps) => {
  const value = useContext(ProviderChat);
  const colorScheme = useColorScheme() || 'light';
  return (
    <WrapInputChat {...props} colorScheme={colorScheme} width={value.width} />
  );
};

export default InputChat;
