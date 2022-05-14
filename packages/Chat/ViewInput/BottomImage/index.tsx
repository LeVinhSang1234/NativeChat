import {
  IImagePickerProvider,
  IKeyboardProvider,
  useProviderImagePicker,
} from '@/ChatProvider/Provider';
import {debounce} from '@/utils';
import bar from '@/utils/bar';
import React, {Component, ForwardedRef, Fragment} from 'react';
import {
  Animated,
  FlatList,
  GestureResponderEvent,
  LayoutAnimation,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import FeedBack from 'react-native-haptic-feedback';
import HeaderSelect from './HeaderSelect';
import ListImage from './ListImage';
import StatusAuth from './StatusAuth';

export declare type IBottomDragProps = {
  colorScheme: 'light' | 'dark';
  provider: IKeyboardProvider;
  heightScreen: number;
  widthScreen: number;
};

interface ISwapBottomDragProps extends IBottomDragProps {
  providerImage: IImagePickerProvider;
}

interface IState {
  heightBackdrop: number | string;
}

class BottomImageRef extends Component<ISwapBottomDragProps, IState> {
  animatedBegin?: boolean;
  beginDrag?: boolean;
  YNowPrevious: number;
  YTouchStart: number;
  animatedHeight: Animated.Value | any;
  maxHeight: number;
  constructor(props: ISwapBottomDragProps) {
    super(props);
    const {heightScreen} = props;
    this.state = {heightBackdrop: 0};
    this.animatedHeight = new Animated.Value(0);
    this.YNowPrevious = 0;
    this.YTouchStart = 0;
    this.removeBeginLayout = debounce(this.removeBeginLayout, 10);
    this.maxHeight = heightScreen - bar.topHeight - 60;
  }

  shouldComponentUpdate(nProps: ISwapBottomDragProps, nState: IState) {
    const {heightBackdrop} = this.state;
    const {providerImage, colorScheme} = this.props;
    return (
      heightBackdrop !== nState.heightBackdrop ||
      providerImage.status !== nProps.providerImage.status ||
      providerImage.photos !== nProps.providerImage.photos ||
      colorScheme !== nProps.colorScheme
    );
  }

  removeBeginLayout = () => {
    const {heightBackdrop} = this.state;
    const {provider} = this.props;
    if (
      heightBackdrop !== 0 &&
      provider.heightStartInit >= this.animatedHeight._value
    ) {
      this.setState({heightBackdrop: 0});
    }
    this.animatedBegin = false;
  };

  animatedLayout = () => {
    if (!this.animatedBegin) {
      this.animatedBegin = true;
      const typeAnimated = Platform.OS === 'ios' ? 'keyboard' : 'easeOut';
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          Platform.OS === 'ios' ? 250 : 10,
          typeAnimated,
          'scaleY',
        ),
        this.removeBeginLayout,
        this.removeBeginLayout,
      );
    }
  };

  openImageSelect = () => {
    const {provider, providerImage} = this.props;
    const {keyboardHeight, keyboardHeightSystem, isKeyboardOpen, openKeyboard} =
      provider;
    const heightOpen = isKeyboardOpen ? keyboardHeight : keyboardHeightSystem;
    openKeyboard();
    if (keyboardHeight <= 34) {
      this.animatedLayout();
    }
    if (providerImage.status.isAuthorized) {
      providerImage.getAlbums();
    }
    Animated.timing(this.animatedHeight, {
      toValue: heightOpen,
      duration: 0,
      useNativeDriver: false,
    }).start();
  };

  closeImageSelect = () => {
    if (this.animatedHeight._value > 0) {
      this.animatedLayout();
      Animated.timing(this.animatedHeight, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).start();
    }
  };

  onMoveShouldSetResponder = ({nativeEvent}: GestureResponderEvent) => {
    const {providerImage} = this.props;
    if (!providerImage.status.isAuthorized) {
      return (
        this.YTouchStart !== 0 &&
        Math.abs(this.YTouchStart - nativeEvent.pageY) > 40
      );
    }
    return !!this.beginDrag;
  };

  onResponderMove = (event: GestureResponderEvent) => {
    const {heightBackdrop} = this.state;
    const height = this.animatedHeight._value;
    const {provider} = this.props;
    if (height > this.maxHeight) {
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
    Animated.timing(this.animatedHeight, {
      toValue: height - heightRemove,
      duration: 5,
      useNativeDriver: false,
    }).start();
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
    this.YTouchStart = 0;
    const height = this.animatedHeight._value;
    let heightValue = 0;
    const {provider} = this.props;
    if (nativeEvent.pageY > this.YNowPrevious) {
      if (height >= provider.heightStartInit) {
        heightValue = provider.keyboardHeight;
      } else {
        provider.removeKeyboard();
      }
    } else {
      if (height > provider.keyboardHeight) {
        FeedBack.trigger('impactHeavy');
        heightValue = this.maxHeight;
      } else {
        provider.dragKeyboard(provider.heightStartInit);
        heightValue = provider.heightStartInit;
      }
    }
    Animated.timing(this.animatedHeight, {
      toValue: heightValue,
      duration: 0,
      useNativeDriver: false,
    }).start();
    this.animatedLayout();
    this.beginDrag = false;
    this.YNowPrevious = 0;
  };

  touchStartView = ({nativeEvent}: GestureResponderEvent) => {
    this.YTouchStart = nativeEvent.pageY;
  };

  render() {
    const {heightBackdrop} = this.state;
    const {colorScheme, heightScreen, providerImage, widthScreen, provider} =
      this.props;
    const shadowColor =
      colorScheme === 'dark' ? 'rgb(255,255,255)' : 'rgb(0,0,0)';
    const backgroundColor =
      colorScheme === 'dark' ? '#141414' : 'rgb(255,255,255)';
    const opacity = this.animatedHeight.interpolate({
      inputRange: [0, provider.keyboardHeightSystem + 20, this.maxHeight],
      outputRange: [0, 0, 0.7],
    });
    return (
      <Fragment>
        <Animated.View
          style={[styles.viewBackdrop, {opacity, height: heightBackdrop}]}
        />
        <Animated.View
          removeClippedSubviews
          style={[
            styles.view,
            {shadowColor, backgroundColor, height: this.animatedHeight},
          ]}
          onTouchStart={this.touchStartView}
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
          {providerImage.status.isAuthorized ? (
            <Fragment>
              <HeaderSelect
                maxHeight={this.maxHeight}
                provider={provider}
                animated={this.animatedHeight}
                providerImage={providerImage}
              />
              <FlatList
                numColumns={3}
                data={providerImage.photos}
                renderItem={({item}) => (
                  <ListImage
                    widthScreen={widthScreen}
                    heightScreen={heightScreen}
                    image={item.image}
                  />
                )}
                onScroll={this.handleScrollView}
                scrollEventThrottle={0}
                removeClippedSubviews
                style={styles.scrollView}
              />
            </Fragment>
          ) : (
            <StatusAuth
              requestAuthorPhotos={providerImage.requestAuthorPhotos}
              status={providerImage.status}
            />
          )}
        </Animated.View>
      </Fragment>
    );
  }
}

export {BottomImageRef};

const BottomImage = React.forwardRef(
  (props: IBottomDragProps, ref: ForwardedRef<BottomImageRef>) => {
    const providerImage = useProviderImagePicker();
    return (
      <BottomImageRef {...props} ref={ref} providerImage={providerImage} />
    );
  },
);

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
    paddingVertical: 3,
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  lineDrag: {
    height: 4.5,
    marginVertical: 4,
    width: 50,
    backgroundColor: '#e3e3e3',
    borderRadius: 100,
  },
  scrollView: {
    paddingBottom: bar.bottomHeight + 10,
  },
  viewBackdrop: {
    position: 'absolute',
    backgroundColor: '#000',
    width: '100%',
  },
});

export default BottomImage;
