import {appConnect} from '@/utils';
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  LogBox,
  Dimensions,
  LayoutChangeEvent,
  Modal,
  useColorScheme,
} from 'react-native';
import {Camera} from '..';
import {ProviderChat} from './Provider';
import {theme} from './theme';

LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

interface IProps {}

interface IState {
  loading: boolean;
  isCamera: boolean;
  width: number;
  height: number;
}

class SwapChatProvider extends Component<
  IProps & {colorScheme: 'light' | 'dark'},
  IState
> {
  constructor(props: IProps & {colorScheme: 'light' | 'dark'}) {
    super(props);
    this.state = {
      loading: true,
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      isCamera: false,
    };
  }

  handleLayout = ({nativeEvent}: LayoutChangeEvent) => {
    const {layout} = nativeEvent;
    const {height, width} = layout;
    this.setState({height, width, loading: false});
  };

  toggleCamera = (flag: boolean): void => {
    this.setState({isCamera: flag});
  };

  render() {
    const {children, colorScheme} = this.props;
    const {loading, width, height, isCamera} = this.state;
    return (
      <ProviderChat.Provider
        value={{
          width,
          height,
          toggleCamera: this.toggleCamera,
          theme,
          colorScheme,
        }}>
        <View style={styles.view} onLayout={this.handleLayout}>
          {loading ? null : children}
        </View>
        <Modal visible={isCamera}>
          <Camera defaultOpen />
        </Modal>
      </ProviderChat.Provider>
    );
  }
}

const ChatProvider = (props: IProps) => {
  const colorScheme: 'light' | 'dark' = useColorScheme() || 'light';
  return <SwapChatProvider {...props} colorScheme={colorScheme} />;
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

export {appConnect};

export default ChatProvider;
