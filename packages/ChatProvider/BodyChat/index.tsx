import ViewKeyboard from '@/ChatProvider/ViewKeyboard';
import bar from '@/utils/bar';
import React, {Component, Fragment} from 'react';
import {
  ImageBackground,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';
import InputChat from '../InputChat';
import {IProviderChat, ProviderChat} from '../Provider';

interface IBodyChatProps extends ScrollViewProps {
  scrollEndFirst?: boolean;
  keyboardDistance?: number;
  inputToolbar: any;
}

class BodyChat extends Component<IBodyChatProps> {
  scrollView?: ScrollView | null;
  scrollNow: number;
  firstComponent: boolean;

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

  onHeightChange = (hPre: number, hNow: number) => {
    this.scrollView?.scrollTo({
      y: this.scrollNow + hNow - hPre,
      animated: false,
    });
  };

  onLayout = (e: LayoutChangeEvent) => {
    const {onLayout, scrollEndFirst} = this.props;
    onLayout?.(e);
    if (scrollEndFirst && this.firstComponent) {
      this.firstComponent = false;
      setTimeout(() => {
        this.scrollView?.scrollToEnd({animated: false});
      }, 0);
    }
  };

  handleCheckScrollToEnd = ({}: any) => {
    // const isEnd = this.isCloseToBottom(nativeEvent);
    // console.log('isEnd ==>', isEnd);
  };

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: any) => {
    return contentSize.height - (layoutMeasurement.height + contentOffset.y);
  };

  renderInput = () => {
    const {inputToolbar} = this.props;
    if (inputToolbar === undefined) {
      return <InputChat />;
    }
    return inputToolbar;
  };

  render() {
    const {
      children,
      keyboardDistance,
      scrollEventThrottle,
      inputToolbar,
      ...props
    } = this.props;
    return (
      <ProviderChat.Consumer>
        {({theme}: IProviderChat) => {
          return (
            <View style={styles.view}>
              <View style={styles.view}>
                <ScrollView
                  {...props}
                  onScroll={this.handleScroll}
                  onLayout={this.onLayout}
                  ref={ref => {
                    this.scrollView = ref;
                  }}
                  scrollEventThrottle={scrollEventThrottle || 200}>
                  <ImageBackground
                    source={{uri: theme.chatBody?.imageBackground?.uri}}
                    style={{backgroundColor: theme.chatBody?.backgroundColor}}>
                    {children}
                  </ImageBackground>
                </ScrollView>
                {this.renderInput()}
              </View>
              <ViewKeyboard
                onHeightChange={this.onHeightChange}
                keyboardDistance={keyboardDistance || bar.bottomHeight}
              />
            </View>
          );
        }}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    position: 'relative',
  },
});

export default BodyChat;
