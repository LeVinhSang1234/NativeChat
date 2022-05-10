import {IProviderChat, useProviderChat} from '@/ChatProvider/Provider';
import {theme} from '@/ChatProvider/theme';
import Text from '@/lib/Text';
import React, {Component} from 'react';
import {
  GestureResponderEvent,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {BlurView} from '..';

export declare type IChatProps = {
  user: {
    _id: string | number;
    url_avatar?: string;
  };
  avatar_url_failback?: string;
};

interface IState {}

class WrapChat extends Component<
  IChatProps & {provider: IProviderChat},
  IState
> {
  onResponderMove = ({nativeEvent}: GestureResponderEvent) => {
    const {provider} = this.props;
    const {height, isOpenKeyboard} = provider;
    const {heightKeyboard, heightInput} = isOpenKeyboard();
    if (height - nativeEvent.pageY <= heightKeyboard + heightInput) {
      const {removeKeyboard} = provider;
      removeKeyboard();
    }
  };

  render() {
    const {provider} = this.props;
    const {height, removeKeyboard} = provider;
    return (
      <BlurView style={[styles.view, {height}]}>
        <ScrollView
          removeClippedSubviews
          style={styles.scrollView}
          onResponderMove={this.onResponderMove}
          contentContainerStyle={styles.contentStyle}>
          <Pressable style={styles.contentPress} onPress={removeKeyboard}>
            <ImageBackground
              source={{uri: theme.chatBody?.imageBackground?.uri}}
              style={{
                backgroundColor: theme.chatBody?.backgroundColor,
              }}>
              <Text>Sang</Text>
            </ImageBackground>
          </Pressable>
        </ScrollView>
      </BlurView>
    );
  }
}

const Chat = React.forwardRef((props: IChatProps, ref: any) => {
  const provider = useProviderChat();
  return <WrapChat {...props} provider={provider} ref={ref} />;
});

const styles = StyleSheet.create({
  view: {
    flex: 1,
    transform: [{scaleY: -1}],
    overflow: 'visible',
  },
  scrollView: {
    overflow: 'visible',
    flexGrow: 1,
  },
  contentPress: {
    transform: [{scaleY: -1}],
    flexGrow: 1,
  },
  contentStyle: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});

export default Chat;
