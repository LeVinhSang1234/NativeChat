import bar from '@/utils/bar';
import React, {Component} from 'react';
import {
  KeyboardEvent,
  LayoutAnimation,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {KeyboardListener} from '..';
import {ProviderChat} from './Provider';
interface IViewKeyboardProps {
  backgroundColor?: string;
  keyboardDistance?: number;
  inputToolbar?: any;
  onShowKeyboard?: any;
  onHideKeyboard?: any;
}

interface ISwapView extends IViewKeyboardProps {}

interface IState {
  height: number;
}
class ViewKeyboard extends Component<ISwapView, IState> {
  initApp: any;
  animatedBegin: boolean;
  timeKeyboard: number;
  unsubHideKeyboard: boolean;
  constructor(props: ISwapView) {
    super(props);
    this.state = {height: bar.bottomHeight};
    this.animatedBegin = false;
    this.timeKeyboard = 250;
    this.unsubHideKeyboard = false;
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
    this.unsubHideKeyboard = false;
    const {endCoordinates, duration} = event;
    this.timeKeyboard = duration;
    this.animatedLayout(duration);
    this.setState({height: endCoordinates.height});
  };

  onWillHide = (event: KeyboardEvent) => {
    if (!this.unsubHideKeyboard) {
      const {duration} = event;
      this.timeKeyboard = duration;
      this.animatedLayout(duration);
      this.setState({height: bar.bottomHeight});
    }
  };

  removeBeginLayout = () => {
    this.animatedBegin = false;
  };

  animatedLayout = (duration: number) => {
    if (this.animatedBegin) {
      return;
    }
    this.animatedBegin = true;
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        Platform.OS === 'ios' ? duration : 10,
        Platform.OS === 'ios' ? 'keyboard' : 'easeOut',
        'scaleY',
      ),
      this.removeBeginLayout,
      this.removeBeginLayout,
    );
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
      <ProviderChat.Consumer>
        {({toggleImage}) => (
          <View style={[styles.view, {height}]}>
            <KeyboardListener
              onWillShow={this.onWillShow}
              onWillHide={this.onWillHide}
              onDidShow={() => toggleImage(0)}
            />
          </View>
        )}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  view: {width: '100%'},
});

export default ViewKeyboard;
