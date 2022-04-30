import {ProviderChat} from '@/ChatProvider/Provider';
import {IconIon} from '@/utils';
import {backgroundIconChat} from '@/utils/variables';
import React, {Component} from 'react';
import {Image, StyleSheet, View, ViewStyle} from 'react-native';
import Text from '../Text';

export interface IMessageProps {
  _id: number | string;
  id?: number | string;
  user: {
    _id: string | number;
    id?: string | number;
    url_avatar?: string;
  };
  text?: string;
  files?: {
    url: string;
    type?: 'video' | 'image';
  }[];
  viewed?: {
    user: {
      _id: string | number;
      id?: string | number;
      url_avatar?: string;
    };
  }[];
  sended?: boolean;
  received?: boolean;
  processSending?: number;
}

export interface IItemMessageProps {
  message: IMessageProps;
  messagePrevious?: IMessageProps;
  messageNext?: IMessageProps;
  user: {
    _id: string | number;
    id?: string | number;
    url_avatar?: string;
  };
}

class ItemMessage extends Component<IItemMessageProps> {
  shouldComponentUpdate(nProps: IItemMessageProps) {
    const {message, user, messageNext, messagePrevious} = nProps;
    return (
      message !== nProps.message ||
      user !== nProps.user ||
      messagePrevious !== nProps.messagePrevious ||
      messageNext !== nProps.messageNext
    );
  }

  renderIconSend = () => {
    const {message, user, messageNext} = this.props;
    const {processSending, sended, received} = message;
    if (message.user._id === messageNext?.user?._id) {
      return <View style={styles.avatarViewedOne} />;
    }
    if (message.viewed?.length) {
      if (message.viewed?.length < 2) {
        return (
          <Image
            style={styles.avatarViewedOne}
            source={{uri: user.url_avatar}}
          />
        );
      }
      return null;
    }
    if (processSending || processSending === 0) {
      return <Text>{process}</Text>;
    }
    if (sended && received) {
      return (
        <IconIon
          style={styles.iconSended}
          name="checkmark-circle"
          color={backgroundIconChat}
        />
      );
    }
    if (sended && !received) {
      return (
        <IconIon
          style={styles.iconSended}
          name="checkmark-circle"
          color="#666768"
        />
      );
    }
  };

  renderAvatar = () => {
    const {message, messageNext} = this.props;
    const {user} = message;
    if (message.user._id === messageNext?.user?._id) {
      return <View style={styles.avatar} />;
    }
    return <Image source={{uri: user.url_avatar}} style={styles.avatar} />;
  };

  renderMessageFromMe = (width: number) => {
    const {message, messageNext, messagePrevious} = this.props;
    const isNextFromMe = message.user._id === messageNext?.user?._id;
    const isPreviousFromMe = message.user._id === messagePrevious?.user?._id;
    let styleContainer: ViewStyle =
      isNextFromMe || isPreviousFromMe ? {marginVertical: 1.2} : {};
    let styleMessage: ViewStyle = isNextFromMe
      ? {borderBottomRightRadius: 2}
      : {};
    if (isPreviousFromMe) {
      styleMessage = {...styleMessage, borderTopRightRadius: 2};
    } else {
      styleContainer = {...styleContainer, marginTop: 20};
    }
    return (
      <View
        style={[
          styles.messageContainer,
          styles.message,
          styles.messageLeft,
          styleContainer,
        ]}>
        <View style={{width: width - 100}}>
          <View style={[styles.message, styles.messageLeft]}>
            {this.renderFiles()}
            {message.text ? (
              <View
                style={[
                  styles.contentMessage,
                  styles.contentMessageLeft,
                  styleMessage,
                ]}>
                <Text style={styles.textMessageLeft}>{message.text}</Text>
              </View>
            ) : null}
            {this.renderIconSend()}
          </View>
        </View>
      </View>
    );
  };

  renderMessageFromOther = (width: number) => {
    const {message, messageNext, messagePrevious} = this.props;
    const isNextFromMe = message.user._id === messageNext?.user?._id;
    const isPreviousFromMe = message.user._id === messagePrevious?.user?._id;
    let styleContainer: ViewStyle =
      isNextFromMe || isPreviousFromMe ? {marginVertical: 1.2} : {};
    let styleMessage: ViewStyle = isNextFromMe
      ? {borderBottomLeftRadius: 2}
      : {};
    if (isPreviousFromMe) {
      styleMessage = {...styleMessage, borderTopLeftRadius: 2};
    } else {
      styleContainer = {...styleContainer, marginTop: 20};
    }
    return (
      <View style={[styles.messageContainer, styles.message, styleContainer]}>
        <View style={{width: width - 100}}>
          <View style={[styles.message]}>
            {this.renderAvatar()}
            <View>
              {message.text ? (
                <View
                  style={[
                    styles.contentMessage,
                    styles.contentMessageRight,
                    styleMessage,
                  ]}>
                  <Text style={styles.textMessageRight}>{message.text}</Text>
                </View>
              ) : null}
              {this.renderFiles()}
            </View>
          </View>
        </View>
      </View>
    );
  };

  renderFiles = () => {
    // const {message} = this.props;
    // const {files} = message;
    // if (files?.length) {
    //   if (files.length === 1) {
    //     return <Image source={{uri: files[0].url}} style={styles.imageOne} />;
    //   }
    // }
    // return null;
    //todo
  };

  render() {
    const {message, user} = this.props;
    return (
      <ProviderChat.Consumer>
        {({width}) =>
          message.user._id === user._id
            ? this.renderMessageFromMe(width)
            : this.renderMessageFromOther(width)
        }
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 10,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageLeft: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  contentMessage: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  contentMessageLeft: {
    backgroundColor: backgroundIconChat,
  },
  contentMessageRight: {
    backgroundColor: '#f1f1f1',
  },
  textMessageLeft: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  textMessageRight: {
    color: '#000',
    fontWeight: '500',
    fontSize: 14,
  },
  avatarViewedOne: {
    width: 15,
    height: 15,
    borderRadius: 100,
    marginHorizontal: 4,
  },
  iconSended: {
    marginHorizontal: 2,
    fontSize: 19,
    marginBottom: -2,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 100,
    marginHorizontal: 4,
  },
  imageOne: {
    width: 100,
    height: 150,
  },
});

export default ItemMessage;
