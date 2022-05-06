import {IProviderChat, useProviderChat} from '@/ChatProvider/Provider';
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

class SwapChat extends Component<IChatProps & {provider: IProviderChat}> {
  isMoveScroll: boolean;

  constructor(props: IChatProps & {provider: IProviderChat}) {
    super(props);
    this.isMoveScroll = false;
  }

  shouldComponentUpdate(nProps: IChatProps & {provider: IProviderChat}) {
    const {provider} = this.props;
    return provider.height !== nProps.provider.height;
  }

  onMouseMove = ({nativeEvent}: any) => {
    const {provider} = this.props;
    const {height, toggleKeyboard, toggleImage} = provider;
    this.isMoveScroll = true;
    if (height - nativeEvent.pageY <= -30) {
      Keyboard.dismiss();
      toggleKeyboard(0);
      toggleImage(0);
    }
  };

  handlePressScroll = () => {
    const {provider} = this.props;
    const {toggleKeyboard, toggleImage} = provider;
    Keyboard.dismiss();
    toggleKeyboard(0);
    toggleImage(0);
  };

  render() {
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
              <Text>sang</Text>
            </ImageBackground>
          </Pressable>
        </ScrollView>
      </View>
    );
  }
}

const Chat = React.forwardRef((props: IChatProps, ref: any) => {
  const value = useProviderChat();
  return <SwapChat {...props} provider={value} ref={ref} />;
});

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
