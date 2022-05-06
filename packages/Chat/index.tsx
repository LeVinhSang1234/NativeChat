import {theme} from '@/ChatProvider/theme';
import Text from '@/lib/Text';
import React, {Component} from 'react';
import {
  ImageBackground,
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
  render() {
    return (
      <View style={styles.view}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentStyle}>
          <Pressable style={styles.contentPress}>
            <ImageBackground
              source={{uri: theme.chatBody?.imageBackground?.uri}}
              style={{
                backgroundColor: theme.chatBody?.backgroundColor,
              }}>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>sang</Text>
              <Text>end</Text>
            </ImageBackground>
          </Pressable>
        </ScrollView>
      </View>
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
  },
  contentStyle: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});

export default Chat;
