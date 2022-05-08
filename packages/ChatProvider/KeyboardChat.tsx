import TextInput from '@/lib/TextInput';
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
import {KeyboardListener} from '..';
import {IProviderChat} from './Provider';
interface IViewKeyboardProps {
  backgroundColor?: string;
  keyboardDistance?: number;
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
  constructor(props: ISwapView) {
    super(props);
    this.state = {height: 0};
    this.animatedBegin = false;
    this.timeKeyboard = 250;
    this.unsubHideKeyboard = false;
    this.removeBeginLayout = debounce(this.removeBeginLayout, 10);
  }

  componentWillUnmount() {
    this.setState = () => null;
  }

  shouldComponentUpdate(nProps: ISwapView, nState: IState) {
    const {keyboardDistance, backgroundColor} = this.props;
    const {height} = this.state;
    return (
      backgroundColor !== nProps.backgroundColor ||
      height !== nState.height ||
      keyboardDistance !== nProps.keyboardDistance
    );
  }

  onWillShow = (event: KeyboardEvent) => {
    const {keyboardDistance = 0} = this.props;
    const {height} = this.state;
    this.unsubHideKeyboard = false;
    const {endCoordinates, duration} = event;
    this.timeKeyboard = duration;
    if (height === 0) {
      this.animatedLayout(duration);
    }
    this.setState({
      height: endCoordinates.height + bar.bottomHeight - keyboardDistance,
    });
  };

  onWillHide = (event: KeyboardEvent) => {
    if (!this.unsubHideKeyboard) {
      const {duration} = event;
      this.timeKeyboard = duration;
      this.animatedLayout(duration);
      this.setState({height: 0});
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

  render() {
    const {height} = this.state;
    return (
      <View style={[styles.view, {minHeight: height}]}>
        <TextInput style={styles.input} multiline />
        <KeyboardListener
          onWillShow={this.onWillShow}
          onWillHide={this.onWillHide}
          onDidShow={this.onDidShow}
        />
      </View>
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
