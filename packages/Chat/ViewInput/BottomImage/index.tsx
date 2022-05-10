import {IKeyboardProvider} from '@/ChatProvider/Provider';
import Text from '@/lib/Text';
import {debounce} from '@/utils';
import bar from '@/utils/bar';
import React, {Component, Fragment} from 'react';
import {
  GestureResponderEvent,
  LayoutAnimation,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import FeedBack from 'react-native-haptic-feedback';

export declare type IBottomDragProps = {
  colorScheme: 'light' | 'dark';
  provider: IKeyboardProvider;
  heightScreen: number;
};

interface IState {
  height: number;
  heightBackdrop: number | string;
}

class BottomImage extends Component<IBottomDragProps, IState> {
  animatedBegin?: boolean;
  beginDrag?: boolean;
  YNowPrevious: number;
  constructor(props: IBottomDragProps) {
    super(props);
    this.state = {height: 0, heightBackdrop: 0};
    this.YNowPrevious = 0;
    this.removeBeginLayout = debounce(this.removeBeginLayout, 10);
  }

  removeBeginLayout = () => {
    const {heightBackdrop, height} = this.state;
    const {provider} = this.props;
    if (heightBackdrop !== 0 && provider.heightStartInit >= height) {
      this.setState({heightBackdrop: 0});
    }
    this.animatedBegin = false;
  };

  animatedLayout = (duration: number = 10) => {
    if (!this.animatedBegin) {
      this.animatedBegin = true;
      const typeAnimated = Platform.OS === 'ios' ? 'keyboard' : 'easeOut';
      LayoutAnimation.configureNext(
        LayoutAnimation.create(duration, typeAnimated, 'scaleY'),
        this.removeBeginLayout,
        this.removeBeginLayout,
      );
    }
  };

  openImageSelect = () => {
    const {provider} = this.props;
    const {keyboardHeight, keyboardHeightSystem, isKeyboardOpen, openKeyboard} =
      provider;
    const heightOpen = isKeyboardOpen ? keyboardHeight : keyboardHeightSystem;
    openKeyboard();
    if (keyboardHeight <= 34) {
      this.animatedLayout();
    }
    this.setState({height: heightOpen});
  };

  closeImageSelect = () => {
    const {height} = this.state;
    if (height > 0) {
      this.animatedLayout();
      this.setState({height: 0});
    }
  };

  onMoveShouldSetResponder = () => {
    return !!this.beginDrag;
  };

  onResponderMove = (event: GestureResponderEvent) => {
    const {height, heightBackdrop} = this.state;
    const {provider, heightScreen} = this.props;
    if (height > heightScreen - bar.topHeight - 60) {
      return;
    }
    let heightRemove = event.nativeEvent.pageY - this.YNowPrevious;
    if (this.YNowPrevious === 0) {
      heightRemove = 0;
    }
    this.YNowPrevious = event.nativeEvent.pageY;
    if (
      height - heightRemove <= provider.keyboardHeight ||
      provider.keyboardHeight <= provider.heightStartInit
    ) {
      provider.dragKeyboard(height - heightRemove);
    }
    if (
      height - heightRemove > provider.heightStartInit &&
      heightBackdrop === 0
    ) {
      this.setState({heightBackdrop: '100%'});
    } else if (
      heightBackdrop === '100%' &&
      height - heightRemove <= provider.heightStartInit
    ) {
      this.setState({heightBackdrop: 0});
    }
    this.setState({height: height - heightRemove});
  };

  beginDragEvent = (event: GestureResponderEvent) => {
    this.YNowPrevious = event.nativeEvent.pageY;
    this.beginDrag = true;
  };

  onTouchEnd = () => {
    this.beginDrag = false;
    this.YNowPrevious = 0;
  };

  handleScrollView = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (nativeEvent.contentOffset.y <= 0) {
      this.beginDrag = true;
    }
  };

  onResponderEnd = ({nativeEvent}: GestureResponderEvent) => {
    const {height} = this.state;
    const {provider, heightScreen} = this.props;
    if (nativeEvent.pageY > this.YNowPrevious) {
      if (height >= provider.heightStartInit) {
        this.setState({height: provider.keyboardHeight});
      } else {
        provider.removeKeyboard();
        this.setState({height: 0});
      }
    } else {
      if (height > provider.keyboardHeight) {
        FeedBack.trigger('impactHeavy');
        this.setState({height: heightScreen - bar.topHeight - 60});
      } else {
        provider.dragKeyboard(provider.heightStartInit);
        this.setState({height: provider.heightStartInit});
      }
    }
    this.animatedLayout();
    this.beginDrag = false;
    this.YNowPrevious = 0;
  };

  render() {
    const {height, heightBackdrop} = this.state;
    const {colorScheme, heightScreen} = this.props;
    const shadowColor =
      colorScheme === 'dark' ? 'rgb(255,255,255)' : 'rgb(0,0,0)';
    const backgroundColor =
      colorScheme === 'dark' ? '#141414' : 'rgb(255,255,255)';
    const opacity = height / (heightScreen - bar.topHeight - 60) - 0.3;

    return (
      <Fragment>
        <View
          style={[
            styles.viewBackdrop,
            {opacity: opacity, height: heightBackdrop},
          ]}
        />
        <View
          style={[styles.view, {shadowColor, backgroundColor, height}]}
          onMoveShouldSetResponder={this.onMoveShouldSetResponder}
          onResponderEnd={this.onResponderEnd}
          onResponderMove={this.onResponderMove}>
          <Pressable
            onTouchEnd={this.onTouchEnd}
            onPressIn={this.beginDragEvent}
            style={styles.wrapDrag}>
            <View style={styles.center}>
              <View style={[styles.lineDrag]} />
            </View>
          </Pressable>
          <ScrollView
            onScroll={this.handleScrollView}
            scrollEventThrottle={0}
            removeClippedSubviews
            style={styles.scrollView}>
            <Text>Snag</Text>
          </ScrollView>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.215,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  wrapDrag: {
    paddingVertical: 4,
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  lineDrag: {
    height: 5,
    marginVertical: 5,
    width: 60,
    backgroundColor: '#e3e3e3',
    borderRadius: 100,
  },
  scrollView: {
    paddingHorizontal: 8,
    paddingBottom: bar.bottomHeight + 10,
  },
  viewBackdrop: {
    position: 'absolute',
    backgroundColor: '#000',
    width: '100%',
  },
});

export default BottomImage;
