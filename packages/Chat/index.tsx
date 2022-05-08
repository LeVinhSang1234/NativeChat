import {IProviderChat, useProviderChat} from '@/ChatProvider/Provider';
import {theme} from '@/ChatProvider/theme';
import {IFormHandle} from '@/lib/Form/types';
import TextInput from '@/lib/TextInput';
import React, {Component} from 'react';
import {
  Button,
  ImageBackground,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Form} from '..';

export declare type IChatProps = {
  user: {
    _id: string | number;
    url_avatar?: string;
  };
  avatar_url_failback?: string;
};

interface ISwapChatProps extends IChatProps {
  provider: IProviderChat;
  form: IFormHandle;
}

class SwapChat extends Component<ISwapChatProps> {
  isMoveScroll: boolean;

  constructor(props: ISwapChatProps) {
    super(props);
    this.isMoveScroll = false;
  }

  shouldComponentUpdate(nProps: ISwapChatProps) {
    const {provider} = this.props;
    return (
      provider.height !== nProps.provider.height ||
      provider.heightKeyboard !== nProps.provider.heightKeyboard
    );
  }

  onMouseMove = ({nativeEvent}: any) => {
    const {provider} = this.props;
    const {height, toggleKeyboard, toggleImage, heightKeyboard} = provider;
    this.isMoveScroll = true;
    if (heightKeyboard && height - nativeEvent.pageY <= heightKeyboard + 20) {
      Keyboard.dismiss();
      toggleKeyboard(0);
      toggleImage(0);
    }
  };

  handlePressScroll = () => {
    const {provider} = this.props;
    const {toggleKeyboard, toggleImage, heightKeyboard} = provider;
    if (heightKeyboard) {
      Keyboard.dismiss();
      toggleKeyboard(0);
      toggleImage(0);
    }
  };

  render() {
    const {form} = this.props;
    return (
      <View style={styles.view} removeClippedSubviews>
        <ScrollView
          removeClippedSubviews
          onTouchMove={this.onMouseMove}
          style={styles.scrollView}
          onTouchEnd={() => {
            this.isMoveScroll = false;
          }}
          contentContainerStyle={styles.contentStyle}>
          <Pressable
            onPress={this.handlePressScroll}
            style={styles.contentPress}>
            <ImageBackground
              source={{uri: theme.chatBody?.imageBackground?.uri}}
              style={{
                backgroundColor: theme.chatBody?.backgroundColor,
              }}>
              <Form>
                <Form.Item
                  name="name"
                  rule={{
                    required: true,
                  }}>
                  <TextInput style={styles.input} />
                </Form.Item>
                <Form.Item
                  name="name2"
                  rule={{
                    required: true,
                  }}>
                  <TextInput style={styles.input} />
                </Form.Item>
                <Form.Item name="name3">
                  <TextInput style={styles.input} />
                </Form.Item>
                <Button
                  onPress={async () => {
                    const data = await form.validateFields();
                    console.log(data);
                  }}
                  title="asdasdsas"
                />
              </Form>
            </ImageBackground>
          </Pressable>
        </ScrollView>
      </View>
    );
  }
}

const Chat = React.forwardRef((props: IChatProps, ref: any) => {
  const value = useProviderChat();
  const form = Form.useForm();
  return <SwapChat {...props} provider={value} ref={ref} form={form} />;
});

const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
    transform: [{scaleY: -1}],
  },
  scrollView: {
    flex: 1,
    overflow: 'visible',
  },
  contentPress: {
    transform: [{scaleY: -1}],
    flexGrow: 1,
  },
  contentStyle: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  input: {
    height: 40,
    backgroundColor: '#e3e3e3',
  },
});

export default Chat;
