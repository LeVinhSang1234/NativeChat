import ViewKeyboard from '@/ChatProvider/ViewKeyboard';
import bar from '@/utils/bar';
import React, {Component, Fragment} from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
} from 'react-native';

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

  render() {
    const {
      children,
      keyboardDistance,
      scrollEventThrottle,
      inputToolbar,
      ...props
    } = this.props;
    return (
      <Fragment>
        <ScrollView
          {...props}
          onScroll={this.handleScroll}
          onLayout={this.onLayout}
          ref={ref => {
            this.scrollView = ref;
          }}
          scrollEventThrottle={scrollEventThrottle || 200}>
          {children}
        </ScrollView>
        <ViewKeyboard
          inputToolbar={inputToolbar}
          onHeightChange={this.onHeightChange}
          keyboardDistance={keyboardDistance || bar.bottomHeight - 15}
        />
      </Fragment>
    );
  }
}

export default BodyChat;
