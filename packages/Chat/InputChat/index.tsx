import {IProviderChat, useProviderChat} from '@/ChatProvider/Provider';
import TextInput from '@/lib/TextInput';
import {debounce} from '@/utils';
import React, {Component} from 'react';
import {
  View,
  LayoutAnimationProperty,
  LayoutAnimation,
  Platform,
} from 'react-native';
import ButtonSend from './ButtonSend';
import Extension from './Extension';

interface IInputChatProps {}

interface ISwapInputProps extends IInputChatProps {
  provider: IProviderChat;
}

interface IState {
  width: number;
  value: string;
}

class SwapInputChat extends Component<ISwapInputProps, IState> {
  animatedBegin?: boolean;
  buttonSend?: ButtonSend | null;
  extension?: Extension | null;
  isLoadLayoutSucess: boolean;

  constructor(props: ISwapInputProps) {
    super(props);
    const {provider} = props;
    this.state = {width: provider.width - 187, value: ''};
    this.isLoadLayoutSucess = false;
    this.removeBeginLayout = debounce(this.removeBeginLayout, 15);
  }

  removeBeginLayout = () => {
    this.animatedBegin = false;
  };

  animatedLayout = (
    duration: number = 10,
    type: LayoutAnimationProperty = 'opacity',
  ) => {
    if (!this.animatedBegin) {
      this.animatedBegin = true;
      const typeAnimated = Platform.OS === 'ios' ? 'keyboard' : 'easeOut';
      LayoutAnimation.configureNext(
        LayoutAnimation.create(duration, typeAnimated, type),
        this.removeBeginLayout,
        this.removeBeginLayout,
      );
    }
  };

  handlePressInput = () => {
    const {provider} = this.props;
    this.extension?.handleVisibleChevron?.(true);
    this.setState({width: provider.width - 108});
    this.animatedLayout();
  };

  handleBlurInput = () => {
    const {provider} = this.props;
    this.extension?.handleVisibleChevron?.(false);
    this.setState({width: provider.width - 187});
    this.animatedLayout();
  };

  handleOnSend = () => {
    const {value} = this.state;
    console.log('value ==>', value);
  };

  handleChangeText = (text: string) => {
    const {value} = this.state;
    if (!value && text) {
      this.buttonSend?.handleAnimated(1);
    } else if (!text && value) {
      this.buttonSend?.handleAnimated(0);
    }
    this.setState({value: text});
  };

  onContentChangeSize = () => {
    if (this.isLoadLayoutSucess) {
      this.animatedLayout();
    }
  };

  onLayoutInput = () => {
    this.isLoadLayoutSucess = true;
  };

  render() {
    const {width, value} = this.state;
    const {provider} = this.props;
    const {theme, colorScheme} = provider;
    const {inputChat} = theme;
    return (
      <View style={theme.avoidingView}>
        <Extension
          handleBlurInput={this.handleBlurInput}
          ref={ref => (this.extension = ref)}
        />
        <TextInput
          onLayout={this.onLayoutInput}
          onContentSizeChange={this.onContentChangeSize}
          onBlur={this.handleBlurInput}
          onPressIn={this.handlePressInput}
          onChangeText={this.handleChangeText}
          multiline
          placeholderTextColor={inputChat?.placeholderTextColor}
          style={[inputChat?.style, inputChat?.[colorScheme], {width}]}>
          {value}
        </TextInput>
        <ButtonSend
          onSend={this.handleOnSend}
          ref={ref => (this.buttonSend = ref)}
        />
      </View>
    );
  }
}

const InputChat = React.forwardRef((props: IInputChatProps, ref: any) => {
  const provider = useProviderChat();
  return <SwapInputChat {...props} ref={ref} provider={provider} />;
});

export default InputChat;
