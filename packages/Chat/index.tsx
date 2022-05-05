import BodyChat from '@/ChatProvider/BodyChat';
import Text from '@/lib/Text';
import React, {Component, Fragment} from 'react';
import {StyleSheet, View} from 'react-native';

export interface IChatProps {
  keyboardDistance?: number;
  inputToolbar?: any;
  user: {
    _id: string | number;
    id?: string | number;
    url_avatar?: string;
  };
  avatar_url_failback?: string;
}

class Chat extends Component<IChatProps> {
  render() {
    const {keyboardDistance, inputToolbar} = this.props;
    return (
      <Fragment>
        <View style={styles.view}>
          <BodyChat
            scrollEndFirst
            inputToolbar={inputToolbar}
            keyboardDistance={keyboardDistance}>
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
            <View style={{backgroundColor: 'red'}}>
              <Text>end</Text>
            </View>
          </BodyChat>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

export default Chat;
