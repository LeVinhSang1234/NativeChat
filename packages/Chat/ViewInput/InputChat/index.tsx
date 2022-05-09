import {IProviderChat, ProviderChat} from '@/ChatProvider/Provider';
import Text from '@/lib/Text';
import TextInput from '@/lib/TextInput';
import {debounce} from '@/utils';
import {backgroundChatDark, backgroundChatLight} from '@/utils/variables';
import React, {Component} from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import ButtonSend from '../ButtonSend';
import Extension from '../Extension';

interface InputChatProps {
  provider: IProviderChat;
}

interface IState {
  open: boolean;
  editable: boolean;
  value: string;
  height: string | number;
}

class InputChat extends Component<InputChatProps, IState> {
  animatedBegin?: boolean;
  buttonSend?: ButtonSend | null;
  refInput: any;
  scrollview?: ScrollView | null;
  constructor(props: InputChatProps) {
    super(props);
    this.state = {open: false, value: '', height: 'auto', editable: false};
    this.removeBeginLayout = debounce(this.removeBeginLayout, 10);
  }

  shouldComponentUpdate(nProps: InputChatProps, nState: IState) {
    const {provider} = this.props;
    const {colorScheme, width} = provider;
    const {open, editable, height} = this.state;
    return (
      colorScheme !== nProps.provider.colorScheme ||
      width !== nProps.provider.width ||
      editable !== nState.editable ||
      height !== nState.height ||
      open !== nState.open
    );
  }

  removeBeginLayout = () => {
    const {open} = this.state;
    if (!open) {
      this.scrollview?.scrollToEnd({animated: false});
    }
    this.animatedBegin = false;
  };

  animatedLayout = (duration: number = 10) => {
    if (!this.animatedBegin) {
      this.animatedBegin = true;
      const typeAnimated = Platform.OS === 'ios' ? 'keyboard' : 'easeOut';
      LayoutAnimation.configureNext(
        LayoutAnimation.create(duration, typeAnimated, 'opacity'),
        this.removeBeginLayout,
        this.removeBeginLayout,
      );
    }
  };

  onPressIn = () => {
    this.scrollview?.scrollTo({animated: false, y: 0});
    const {editable} = this.state;
    if (!editable) {
      this.setState({editable: true});
    }
  };

  focusInput = () => {
    this.animatedLayout();
    this.refInput?.focus?.();
    this.setState({open: true, height: 'auto'});
  };

  blurInput = () => {
    this.animatedLayout();
    this.setState({open: false, height: 37});
  };

  widthInput = () => {
    const {provider} = this.props;
    const {open} = this.state;
    return provider.width - (open ? 108 : 187);
  };

  onChangeText = (value: string) => {
    const next: any = Number(!!value);
    this.buttonSend?.handleAnimated?.(next);
    this.setState({value});
  };

  onSend = () => {};

  render() {
    const styleInput = {
      light: {backgroundColor: backgroundChatLight},
      dark: {backgroundColor: backgroundChatDark, color: '#fff'},
    };
    const {provider} = this.props;
    const {open, height, value: valueInput, editable} = this.state;
    return (
      <View style={styles.avoidingView}>
        <ProviderChat.Consumer>
          {value => (
            <Extension
              visibleChevron={open}
              provider={value}
              handleBlurInput={this.blurInput}
            />
          )}
        </ProviderChat.Consumer>
        <Pressable
          onPressIn={this.onPressIn}
          onPressOut={this.focusInput}
          style={[
            styles.wrapInput,
            styleInput[provider.colorScheme],
            {width: this.widthInput(), height},
          ]}>
          <ScrollView
            removeClippedSubviews
            ref={ref => (this.scrollview = ref)}>
            <TextInput
              ref={ref => (this.refInput = ref)}
              style={styles.input}
              editable={editable}
              scrollEnabled={false}
              multiline
              onContentSizeChange={() => this.animatedLayout()}
              onChangeText={this.onChangeText}
              onPressOut={this.focusInput}
              onPressIn={this.onPressIn}
              onBlur={this.blurInput}
              placeholder="Aa"
              placeholderTextColor="#6e6e6e">
              <Text>{valueInput}</Text>
            </TextInput>
          </ScrollView>
        </Pressable>
        <ButtonSend ref={ref => (this.buttonSend = ref)} onSend={this.onSend} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avoidingView: {
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  wrapInput: {
    minHeight: 37,
    borderRadius: 20,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 150,
    overflow: 'hidden',
    transform: [{scaleY: -1}],
  },
  input: {
    paddingTop: 0,
    textAlignVertical: 'center',
    transform: [{scaleY: -1}],
  },
});

export default InputChat;
