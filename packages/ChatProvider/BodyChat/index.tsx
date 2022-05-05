import ViewKeyboard from '@/ChatProvider/ViewKeyboard';
import React, {Component} from 'react';
import {
  GestureResponderEvent,
  ImageBackground,
  Keyboard,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';
import {IProviderChat, ProviderChat} from '../Provider';
import {ProviderKeyboardView} from '../ViewKeyboardProvider';

interface IBodyChatProps extends ScrollViewProps {
  scrollEndFirst?: boolean;
  keyboardDistance?: number;
  inputToolbar: any;
}

class BodyChat extends Component<IBodyChatProps> {
  scrollView?: ScrollView | null;
  scrollNow: number;
  firstComponent: boolean;
  viewKeyboard?: ViewKeyboard | null;

  constructor(props: IBodyChatProps) {
    super(props);
    this.scrollNow = 0;
    this.firstComponent = true;
  }

  shouldComponentUpdate(nProps: IBodyChatProps) {
    const {keyboardDistance, inputToolbar} = this.props;
    return (
      keyboardDistance !== nProps.keyboardDistance ||
      inputToolbar !== nProps.inputToolbar
    );
  }

  handleScroll = ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {contentOffset} = nativeEvent;
    const {y} = contentOffset;
    this.handleCheckScrollToEnd({nativeEvent});
    this.scrollNow = y;
  };

  onHeightChange = (h: number = 0, animated: boolean = false) => {
    this.scrollView?.scrollTo({y: this.scrollNow + h, animated});
  };

  onLayout = (e: any) => {
    const {scrollEndFirst} = this.props;
    e.persist();
    if (scrollEndFirst && this.firstComponent) {
      this.firstComponent = false;
      setTimeout(() => {
        e.target?.scrollToEnd({animated: false});
      }, 1);
    }
  };

  handleCheckScrollToEnd = ({}: any) => {
    // const isEnd = this.isCloseToBottom(nativeEvent);
    // console.log('isEnd ==>', isEnd);
  };

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: any) => {
    return contentSize.height - (layoutMeasurement.height + contentOffset.y);
  };

  toggleKeyboard = (height: number, callback?: () => any) => {
    this.viewKeyboard?.toggleImage?.(height, callback);
  };

  onMouseMove = (
    {nativeEvent}: GestureResponderEvent,
    toggleImage: (h: number) => any,
    height: number,
  ) => {
    const {isOpen, height: heightKeyboard} =
      this.viewKeyboard?.isKeyboardOpen?.() || {
        isOpen: false,
        height: 0,
      };
    if (!isOpen) {
      return;
    }
    if (height - nativeEvent.pageY <= heightKeyboard) {
      Keyboard.dismiss();
      this.toggleKeyboard(0, () => toggleImage(0));
    }
  };

  render() {
    const {children, keyboardDistance} = this.props;
    return (
      <ProviderChat.Consumer>
        {({theme, toggleImage, height}: IProviderChat) => {
          return (
            <ProviderKeyboardView.Provider
              value={{
                toggleKeyboard: this.toggleKeyboard,
              }}>
              <View style={styles.view} removeClippedSubviews>
                <ScrollView
                  removeClippedSubviews
                  style={styles.scrollView}
                  onScroll={this.handleScroll}
                  onLayout={this.onLayout}
                  onTouchMove={e => this.onMouseMove(e, toggleImage, height)}
                  ref={ref => {
                    this.scrollView = ref;
                  }}
                  scrollEventThrottle={200}>
                  <Pressable
                    onPress={() => {
                      this.toggleKeyboard(0, () => toggleImage(0));
                    }}>
                    <ImageBackground
                      source={{uri: theme.chatBody?.imageBackground?.uri}}
                      style={{
                        backgroundColor: theme.chatBody?.backgroundColor,
                      }}>
                      {children}
                    </ImageBackground>
                  </Pressable>
                </ScrollView>
                <ViewKeyboard
                  ref={ref => {
                    this.viewKeyboard = ref;
                  }}
                  onHeightChange={this.onHeightChange}
                  keyboardDistance={keyboardDistance || 0}
                />
              </View>
            </ProviderKeyboardView.Provider>
          );
        }}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    overflow: 'hidden',
  },
  scrollView: {
    overflow: 'visible',
  },
});

export default BodyChat;
