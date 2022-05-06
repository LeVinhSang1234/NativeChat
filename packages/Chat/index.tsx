import {IProviderChat, ProviderChat} from '@/ChatProvider/Provider';
import {theme} from '@/ChatProvider/theme';
import Text from '@/lib/Text';
import React, {Component} from 'react';
import {
  ImageBackground,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

export declare type IChatProps = {
  user: {
    _id: string | number;
    url_avatar?: string;
  };
  avatar_url_failback?: string;
};

class Chat extends Component<IChatProps> {
  isMoveScroll: boolean;

  constructor(props: IChatProps) {
    super(props);
    this.isMoveScroll = false;
  }

  onMouseMove = ({nativeEvent}: any, value: IProviderChat) => {
    const {height, toggleKeyboard, toggleImage} = value;
    this.isMoveScroll = true;
    if (height - nativeEvent.pageY <= -30) {
      Keyboard.dismiss();
      toggleKeyboard(0);
      toggleImage(0);
    }
  };

  handlePressScroll = (value: IProviderChat) => {
    const {toggleKeyboard, toggleImage} = value;
    Keyboard.dismiss();
    toggleKeyboard(0);
    toggleImage(0);
  };

  render() {
    return (
      <ProviderChat.Consumer>
        {value => (
          <View style={styles.view} removeClippedSubviews>
            <ScrollView
              removeClippedSubviews
              onTouchMove={e => this.onMouseMove(e, value)}
              style={styles.scrollView}
              onTouchEnd={() => {
                this.isMoveScroll = false;
              }}
              contentContainerStyle={styles.contentStyle}>
              <Pressable
                onPress={() => this.handlePressScroll(value)}
                style={styles.contentPress}>
                <ImageBackground
                  source={{uri: theme.chatBody?.imageBackground?.uri}}
                  style={{
                    backgroundColor: theme.chatBody?.backgroundColor,
                  }}>
                  <Text>sang</Text>
                </ImageBackground>
              </Pressable>
            </ScrollView>
          </View>
        )}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
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
});

export default Chat;
