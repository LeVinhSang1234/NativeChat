import {ProviderChat} from '@/ChatProvider/Provider';
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

  onMouseMove = ({nativeEvent}: any, height: number, toggleKeyboard: any) => {
    this.isMoveScroll = true;
    if (height - nativeEvent.pageY <= -30) {
      Keyboard.dismiss();
      toggleKeyboard?.(0);
    }
  };

  handlePressScroll = (toggleKeyboard: any) => {
    Keyboard.dismiss();
    toggleKeyboard?.(0);
  };

  render() {
    return (
      <ProviderChat.Consumer>
        {({toggleKeyboard, height}) => (
          <View style={styles.view} removeClippedSubviews>
            <ScrollView
              removeClippedSubviews
              onTouchMove={e => this.onMouseMove(e, height, toggleKeyboard)}
              style={styles.scrollView}
              onTouchEnd={() => {
                this.isMoveScroll = false;
              }}
              contentContainerStyle={styles.contentStyle}>
              <Pressable
                onPress={() => this.handlePressScroll(toggleKeyboard)}
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
