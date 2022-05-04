import {ProviderChat} from '@/ChatProvider/Provider';
import {IconIon} from '@/utils';
import {backgroundIconChat} from '@/utils/variables';
import React, {Component} from 'react';
import {Image, StyleSheet, View, ViewStyle} from 'react-native';
import Text from '../../lib/Text';
import ImageChat from '../ImageChat';
import TextMessage from './TextMessage';

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
  isLastMessage?: boolean;
}

class ItemMessage extends Component<IItemMessageProps> {
  shouldComponentUpdate(nProps: IItemMessageProps) {
    const {message, user, messageNext, messagePrevious, isLastMessage} = nProps;
    return (
      message !== nProps.message ||
      user !== nProps.user ||
      messagePrevious !== nProps.messagePrevious ||
      messageNext !== nProps.messageNext ||
      isLastMessage !== nProps.isLastMessage
    );
  }

  renderIconSend = () => {
    const {message, user} = this.props;
    const {processSending, sended} = message;
    const isOwner = user._id === message.user._id;
    const vieweds = message.viewed?.filter(e => e.user._id! === user._id);
    if (vieweds?.length) {
      if (vieweds.length < 2 && isOwner) {
        return (
          <Image
            style={styles.avatarViewedOne}
            source={{uri: vieweds[0].user.url_avatar}}
          />
        );
      }
      return null;
    }
    if (processSending || processSending === 0) {
      return <Text>{process}</Text>;
    }
    if (sended && isOwner) {
      return (
        <IconIon
          style={styles.iconSended}
          name="checkmark-circle"
          color={backgroundIconChat}
        />
      );
    }
  };

  renderVieweds = () => {
    const {message, isLastMessage} = this.props;
    if (
      !message.viewed ||
      !isLastMessage ||
      (message.viewed && message.viewed.length < 2)
    ) {
      return null;
    }
    return (
      <View style={styles.vieweds}>
        {message.viewed?.map(v => (
          <Image
            style={styles.avatarViewedMany}
            source={{uri: v.user.url_avatar}}
          />
        ))}
      </View>
    );
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
    const {message, messageNext, messagePrevious, isLastMessage} = this.props;
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
            {message.text ? (
              <TextMessage
                colorMessage="#fff"
                style={[styles.contentMessage, styles.contentMessageLeft]}
                borderBottomRightRadius={isNextFromMe ? 2 : undefined}
                borderTopRightRadius={isPreviousFromMe ? 2 : undefined}
                message={message.text}
              />
            ) : (
              this.renderFiles(styleMessage)
            )}

            {isLastMessage ? (
              this.renderIconSend()
            ) : (
              <View style={styles.avatarViewedOne} />
            )}
          </View>
          {this.renderVieweds()}
        </View>
      </View>
    );
  };

  renderMessageFromOther = (width: number) => {
    const {message, messageNext, messagePrevious, isLastMessage} = this.props;
    if (!message.text && !message.files?.length) {
      return null;
    }
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
        <View style={{width}}>
          <View style={{width: width - 100}}>
            <View style={[styles.message]}>
              {this.renderAvatar()}
              {message.text ? (
                <TextMessage
                  colorMessage="#000"
                  style={[styles.contentMessage, styles.contentMessageRight]}
                  borderBottomLeftRadius={isNextFromMe ? 2 : undefined}
                  borderTopLeftRadius={isPreviousFromMe ? 2 : undefined}
                  message={message.text}
                />
              ) : (
                this.renderFiles(styleMessage)
              )}
            </View>
          </View>
          {isLastMessage ? (
            <View style={styles.viewIconLast}>{this.renderIconSend()}</View>
          ) : null}
          {this.renderVieweds()}
        </View>
      </View>
    );
  };

  renderFiles = (styleMessage: any) => {
    const {message} = this.props;
    const {files} = message;
    if (files?.length === 1) {
      return <ImageChat style={styleMessage} uri={files[0].url} />;
    }
    return (
      <View style={styles.viewFiles}>
        {files?.map((file, i) => (
          <ImageChat key={i} style={styles.imageChat} uri={file.url} />
        ))}
      </View>
    );
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
  imageChat: {
    width: 70,
    height: 70,
    borderRadius: 4,
    marginRight: 1,
    marginBottom: 1,
  },
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
  avatarViewedOne: {
    width: 15,
    height: 15,
    borderRadius: 100,
    marginHorizontal: 4,
  },
  avatarViewedMany: {
    width: 15,
    height: 15,
    borderRadius: 100,
    marginHorizontal: 0.5,
    backgroundColor: '#e3e3e3',
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
  viewFiles: {
    flexDirection: 'row',
  },
  vieweds: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 4,
  },
  viewIconLast: {
    width: 100,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default ItemMessage;
