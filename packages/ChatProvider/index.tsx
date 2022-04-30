import {appConnect} from '@/utils';
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  LogBox,
  Dimensions,
  LayoutChangeEvent,
  Modal,
} from 'react-native';
import {Camera} from '..';
import {ProviderChat} from './Provider';

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

class ChatProvider extends Component<IProps, IState> {
  constructor(props: IProps) {
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
    const {children} = this.props;
    const {loading, width, height, isCamera} = this.state;
    return (
      <ProviderChat.Provider
        value={{width, height, toggleCamera: this.toggleCamera}}>
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

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

export {appConnect};

export default ChatProvider;
