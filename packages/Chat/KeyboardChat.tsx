import InputChat from '@/Chat/InputChat';
import {debounce} from '@/utils';
import bar from '@/utils/bar';
import React, {Component} from 'react';
import {
  KeyboardEvent,
  LayoutAnimation,
  LayoutAnimationProperty,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {BlurView, KeyboardListener} from '..';
import {IProviderChat} from '../ChatProvider/Provider';
interface IViewKeyboardProps {
  backgroundColor?: string;
  keyboardDistanceFromInput?: number;
  inputToolbar?: any;
  onShowKeyboard?: any;
  onHideKeyboard?: any;
  provider: IProviderChat;
}

interface ISwapView extends IViewKeyboardProps {}

interface IState {
  height: number;
}
class KeyboardChat extends Component<ISwapView, IState> {
  initApp: any;
  animatedBegin: boolean;
  timeKeyboard: number;
  unsubHideKeyboard: boolean;
  heightKeyboard: number;
  isOpenKeyboard: boolean;
  heightFirstKeyboard: number;
  constructor(props: ISwapView) {
    super(props);
    this.state = {height: bar.bottomHeight};
    this.animatedBegin = false;
    this.timeKeyboard = 250;
    this.heightKeyboard = 250;
    this.heightFirstKeyboard = 0;
    this.unsubHideKeyboard = false;
    this.isOpenKeyboard = false;
    this.removeBeginLayout = debounce(this.removeBeginLayout, 10);
  }

  componentWillUnmount() {
    this.setState = () => null;
  }

  shouldComponentUpdate(nProps: ISwapView, nState: IState) {
    const {keyboardDistanceFromInput, backgroundColor, inputToolbar} =
      this.props;
    const {height} = this.state;
    return (
      backgroundColor !== nProps.backgroundColor ||
      inputToolbar !== nProps.inputToolbar ||
      height !== nState.height ||
      keyboardDistanceFromInput !== nProps.keyboardDistanceFromInput
    );
  }

  onWillShow = (event: KeyboardEvent) => {
    const {keyboardDistanceFromInput = 0} = this.props;
    const {height} = this.state;
    const {endCoordinates, duration} = event;
    this.heightKeyboard = endCoordinates.height;
    this.unsubHideKeyboard = false;
    this.timeKeyboard = duration;
    if (this.heightFirstKeyboard === 0) {
      this.heightFirstKeyboard = endCoordinates.height;
    }
    if (height === bar.bottomHeight || !this.isOpenKeyboard) {
      this.animatedLayout(duration);
    }
    this.isOpenKeyboard = true;
    this.setState({
      height: endCoordinates.height + keyboardDistanceFromInput,
    });
  };

  onWillHide = (event: KeyboardEvent) => {
    this.isOpenKeyboard = false;
    if (!this.unsubHideKeyboard) {
      const {duration} = event;
      this.animatedLayout(duration);
      this.setState({height: bar.bottomHeight});
    }
  };

  onDidShow = () => {
    const {provider} = this.props;
    provider.toggleImage(0);
  };

  removeBeginLayout = () => {
    this.animatedBegin = false;
  };

  animatedLayout = (
    duration: number = 10,
    type: LayoutAnimationProperty = 'scaleY',
  ) => {
    if (!this.animatedBegin) {
      this.animatedBegin = true;
      const typeAnimated = Platform.OS === 'ios' ? 'keyboard' : 'easeOut';
      LayoutAnimation.configureNext(
        LayoutAnimation.create(duration, typeAnimated, type),
        this.removeBeginLayout,
        this.removeBeginLayout,
      );
    }
  };

  toggleKeyboard = (h: number = bar.bottomHeight) => {
    let height = h;
    this.unsubHideKeyboard = !!h;
    if (height === 0) {
      height = bar.bottomHeight;
    }
    const {height: heightState} = this.state;
    if (heightState === height) {
      return;
    }
    this.animatedLayout(this.timeKeyboard);
    this.setState({height});
  };

  unsubHideKeyboardFuc = () => {
    this.unsubHideKeyboard = true;
  };

  onDidHide = () => {
    if (this.heightFirstKeyboard) {
      this.heightKeyboard = this.heightFirstKeyboard;
    }
  };

  render() {
    const {height} = this.state;
    const {inputToolbar} = this.props;
    return (
      <BlurView blurAmount={20}>
        {inputToolbar || <InputChat />}
        <View style={[styles.view, {height}]}>
          <KeyboardListener
            onWillShow={this.onWillShow}
            onWillHide={this.onWillHide}
            onDidShow={this.onDidShow}
            onDidHide={this.onDidHide}
          />
        </View>
      </BlurView>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
  },
  input: {
    height: 40,
    backgroundColor: '#e3e3e3',
  },
});

export default KeyboardChat;
