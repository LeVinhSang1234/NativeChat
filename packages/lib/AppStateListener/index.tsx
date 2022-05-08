import {Component} from 'react';
import {AppState} from 'react-native';

export declare type IAppStateProps = {
  onBackground?: () => any;
  onActive?: () => any;
};

class AppStateListener extends Component<IAppStateProps> {
  subscription: any;
  appState: string;
  constructor(props: IAppStateProps) {
    super(props);
    const {onBackground, onActive} = props;
    this.appState = '';
    this.subscription = AppState.addEventListener('change', nextAppState => {
      if (
        this.appState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        onActive?.();
      } else {
        onBackground?.();
      }
      this.appState = nextAppState;
    });
  }

  componentWillUnmount() {
    this.subscription?.remove?.();
  }

  render() {
    return null;
  }
}

export default AppStateListener;
