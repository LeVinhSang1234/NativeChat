import {IProviderChat} from '@/ChatProvider/Provider';
import {theme} from '@/ChatProvider/theme';
import Text from '@/lib/Text';
import React, {Component} from 'react';
import {ImageBackground, Pressable, ScrollView, StyleSheet} from 'react-native';
import {BlurView} from '..';

export declare type IChatProps = {
  user: {
    _id: string | number;
    url_avatar?: string;
  };
  avatar_url_failback?: string;
};

interface ISwapChatProps extends IChatProps {
  provider: IProviderChat;
}

class Chat extends Component<ISwapChatProps> {
  isMoveScroll: boolean;

  constructor(props: ISwapChatProps) {
    super(props);
    this.isMoveScroll = false;
  }

  render() {
    return (
      <BlurView style={styles.view}>
        <ScrollView
          removeClippedSubviews
          style={styles.scrollView}
          contentContainerStyle={styles.contentStyle}>
          <Pressable style={styles.contentPress}>
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

const styles = StyleSheet.create({
  view: {
    flex: 1,
    transform: [{scaleY: -1}],
    overflow: 'visible',
  },
  scrollView: {
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
});

export default Chat;
