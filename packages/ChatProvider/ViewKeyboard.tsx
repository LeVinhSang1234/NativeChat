import bar from '@/utils/bar';
import {BlurView} from '@react-native-community/blur';
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
}

interface ISwapView extends IViewKeyboardProps {}

interface IState {
  height: number;
}
class ViewKeyboard extends Component<ISwapView, IState> {
  initApp: any;
  constructor(props: ISwapView) {
    super(props);
    this.state = {height: bar.bottomHeight};
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
    const {endCoordinates, duration, easing} = event;
    if (Platform.OS === 'ios') {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(duration, easing, 'opacity'),
      );
    }
    this.setState({height: endCoordinates.height});
  };

  onWillHide = (event: KeyboardEvent) => {
    const {duration, easing} = event;
    this.setState({height: bar.bottomHeight});
    if (Platform.OS === 'ios') {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(duration, easing, 'opacity'),
      );
    }
  };

  render() {
    const {backgroundColor} = this.props;
    const {height} = this.state;
    return (
      <ProviderChat.Consumer>
        {({width, colorScheme}) => (
          <BlurView
            blurType={colorScheme}
            style={[styles.view, {backgroundColor}]}>
            <View style={{height, width}}>
              <KeyboardListener
                onWillShow={this.onWillShow}
                onWillHide={this.onWillHide}
              />
            </View>
          </BlurView>
        )}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    position: 'relative',
  },
});

export default ViewKeyboard;
