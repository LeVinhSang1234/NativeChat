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
  constructor(props: ISwapView) {
    super(props);
    this.state = {height: bar.bottomHeight};
    this.animatedBegin = false;
    this.timeKeyboard = 250;
    this.heightKeyboard = 250;
    this.unsubHideKeyboard = false;
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
    this.heightKeyboard = height;
    this.unsubHideKeyboard = false;
    const {endCoordinates, duration} = event;
    this.timeKeyboard = duration;
    if (height === bar.bottomHeight) {
      this.animatedLayout(duration);
    }
    this.setState({
      height: endCoordinates.height + keyboardDistanceFromInput,
    });
  };

  onWillHide = (event: KeyboardEvent) => {
    if (!this.unsubHideKeyboard) {
      const {duration} = event;
      this.timeKeyboard = duration;
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
