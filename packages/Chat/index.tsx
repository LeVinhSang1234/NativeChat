import BodyChat from '@/lib/BodyChat';
import ItemMessage, {IMessageProps} from '@/lib/ItemMessage';
import bar from '@/utils/bar';
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

const messages: IMessageProps[] = [
  {
    _id: 1,
    text: 'test message',
    user: {
      _id: 1,
      url_avatar:
        'https://scontent.fhan5-8.fna.fbcdn.net/v/t39.30808-1/267756746_1921722874696725_9131067478610767912_n.jpg?stp=dst-jpg_p320x320&_nc_cat=110&ccb=1-5&_nc_sid=7206a8&_nc_ohc=FeZJbsfBwpkAX-CXI2r&tn=KlefKtJHk0ucIYfX&_nc_ht=scontent.fhan5-8.fna&oh=00_AT_YknZCsdQolAtzHrvquWt1TJ2-ZWSOMA-L6Whc62ZECw&oe=6276E1A9',
    },
    viewed: [
      {
        user: {
          _id: 1,
          url_avatar:
            'https://scontent.fhan5-8.fna.fbcdn.net/v/t39.30808-1/267756746_1921722874696725_9131067478610767912_n.jpg?stp=dst-jpg_p320x320&_nc_cat=110&ccb=1-5&_nc_sid=7206a8&_nc_ohc=FeZJbsfBwpkAX-CXI2r&tn=KlefKtJHk0ucIYfX&_nc_ht=scontent.fhan5-8.fna&oh=00_AT_YknZCsdQolAtzHrvquWt1TJ2-ZWSOMA-L6Whc62ZECw&oe=6276E1A9',
        },
      },
    ],
  },
  {
    _id: 2,
    files: [
      {
        url: 'https://scontent.fhan5-9.fna.fbcdn.net/v/t1.15752-9/274080230_283699243851943_5772382507562809807_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=lNOkQAWcYlUAX_6cHlW&_nc_ht=scontent.fhan5-9.fna&oh=03_AVI-_Ud8lzIx32vlKH80HzQU1TnylRN7imHB-yKWhAaQxg&oe=629619FF',
        type: 'video',
      },
    ],
    user: {
      _id: 2,
      url_avatar:
        'https://scontent.fhan5-8.fna.fbcdn.net/v/t39.30808-1/267756746_1921722874696725_9131067478610767912_n.jpg?stp=dst-jpg_p320x320&_nc_cat=110&ccb=1-5&_nc_sid=7206a8&_nc_ohc=FeZJbsfBwpkAX-CXI2r&tn=KlefKtJHk0ucIYfX&_nc_ht=scontent.fhan5-8.fna&oh=00_AT_YknZCsdQolAtzHrvquWt1TJ2-ZWSOMA-L6Whc62ZECw&oe=6276E1A9',
    },
    text: 'Hello Demo Chat',
  },
  {
    _id: 3,
    files: [
      {
        url: 'https://scontent.fhan5-9.fna.fbcdn.net/v/t1.15752-9/274080230_283699243851943_5772382507562809807_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=lNOkQAWcYlUAX_6cHlW&_nc_ht=scontent.fhan5-9.fna&oh=03_AVI-_Ud8lzIx32vlKH80HzQU1TnylRN7imHB-yKWhAaQxg&oe=629619FF',
        type: 'video',
      },
    ],
    user: {
      _id: 2,
      url_avatar:
        'https://scontent.fhan5-8.fna.fbcdn.net/v/t39.30808-1/267756746_1921722874696725_9131067478610767912_n.jpg?stp=dst-jpg_p320x320&_nc_cat=110&ccb=1-5&_nc_sid=7206a8&_nc_ohc=FeZJbsfBwpkAX-CXI2r&tn=KlefKtJHk0ucIYfX&_nc_ht=scontent.fhan5-8.fna&oh=00_AT_YknZCsdQolAtzHrvquWt1TJ2-ZWSOMA-L6Whc62ZECw&oe=6276E1A9',
    },
    text: 'Hello Demo Chat',
  },
  {
    _id: 4,
    files: [
      {
        url: 'https://scontent.fhan5-9.fna.fbcdn.net/v/t1.15752-9/274080230_283699243851943_5772382507562809807_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=lNOkQAWcYlUAX_6cHlW&_nc_ht=scontent.fhan5-9.fna&oh=03_AVI-_Ud8lzIx32vlKH80HzQU1TnylRN7imHB-yKWhAaQxg&oe=629619FF',
        type: 'video',
      },
      {
        url: 'https://scontent.fhan5-9.fna.fbcdn.net/v/t1.15752-9/274080230_283699243851943_5772382507562809807_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=lNOkQAWcYlUAX_6cHlW&_nc_ht=scontent.fhan5-9.fna&oh=03_AVI-_Ud8lzIx32vlKH80HzQU1TnylRN7imHB-yKWhAaQxg&oe=629619FF',
        type: 'video',
      },
    ],
    text: 'Hello Demo Chat',
    user: {
      _id: 2,
      url_avatar:
        'https://scontent.fhan5-8.fna.fbcdn.net/v/t39.30808-1/267756746_1921722874696725_9131067478610767912_n.jpg?stp=dst-jpg_p320x320&_nc_cat=110&ccb=1-5&_nc_sid=7206a8&_nc_ohc=FeZJbsfBwpkAX-CXI2r&tn=KlefKtJHk0ucIYfX&_nc_ht=scontent.fhan5-8.fna&oh=00_AT_YknZCsdQolAtzHrvquWt1TJ2-ZWSOMA-L6Whc62ZECw&oe=6276E1A9',
    },
  },
  {
    _id: 5,
    text: 'Hello Demo Chat',
    user: {
      _id: 1,
      url_avatar:
        'https://scontent.fhan5-8.fna.fbcdn.net/v/t39.30808-1/267756746_1921722874696725_9131067478610767912_n.jpg?stp=dst-jpg_p320x320&_nc_cat=110&ccb=1-5&_nc_sid=7206a8&_nc_ohc=FeZJbsfBwpkAX-CXI2r&tn=KlefKtJHk0ucIYfX&_nc_ht=scontent.fhan5-8.fna&oh=00_AT_YknZCsdQolAtzHrvquWt1TJ2-ZWSOMA-L6Whc62ZECw&oe=6276E1A9',
    },
    sended: true,
    received: true,
  },
  {
    _id: 6,
    text: 'Hello Demo Chat 2',
    user: {
      _id: 1,
      url_avatar:
        'https://scontent.fhan5-8.fna.fbcdn.net/v/t39.30808-1/267756746_1921722874696725_9131067478610767912_n.jpg?stp=dst-jpg_p320x320&_nc_cat=110&ccb=1-5&_nc_sid=7206a8&_nc_ohc=FeZJbsfBwpkAX-CXI2r&tn=KlefKtJHk0ucIYfX&_nc_ht=scontent.fhan5-8.fna&oh=00_AT_YknZCsdQolAtzHrvquWt1TJ2-ZWSOMA-L6Whc62ZECw&oe=6276E1A9',
    },
    sended: true,
    received: false,
  },
];

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
            {messages.map((e: IMessageProps, i) => (
              <ItemMessage
                key={i.toString()}
                message={e}
                messagePrevious={messages[i - 1]}
                messageNext={messages[i + 1]}
                user={{
                  _id: 1,
                  url_avatar:
                    'https://scontent.fhan5-8.fna.fbcdn.net/v/t39.30808-1/267756746_1921722874696725_9131067478610767912_n.jpg?stp=dst-jpg_p320x320&_nc_cat=110&ccb=1-5&_nc_sid=7206a8&_nc_ohc=FeZJbsfBwpkAX-CXI2r&tn=KlefKtJHk0ucIYfX&_nc_ht=scontent.fhan5-8.fna&oh=00_AT_YknZCsdQolAtzHrvquWt1TJ2-ZWSOMA-L6Whc62ZECw&oe=6276E1A9',
                }}
              />
            ))}
          </BodyChat>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    paddingTop: bar.topHeight,
  },
});

export default Chat;
