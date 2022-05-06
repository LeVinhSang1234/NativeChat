import {ProviderChat} from '@/ChatProvider/Provider';
import KeyboardListener from '@/lib/KeyboardListener';
import {IconIon} from '@/utils';
import {backgroundIconChat} from '@/utils/variables';
import React, {Component} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Pressable,
  KeyboardEvent,
  Keyboard,
} from 'react-native';

interface IExtensionProps {
  animated: Animated.Value;
}

class Extension extends Component<IExtensionProps> {
  heightKeyboard: number;
  constructor(props: IExtensionProps) {
    super(props);
    this.heightKeyboard = 250;
  }

  onWillShowKeyboard = ({endCoordinates}: KeyboardEvent) => {
    this.heightKeyboard = endCoordinates.height;
  };

  render() {
    return (
      <ProviderChat.Consumer>
        {({toggleCamera, toggleKeyboard, toggleImage}) => (
          <View style={[styles.view]}>
            <Pressable
              style={[styles.viewIcon, styles.flexStart]}
              onPress={() => toggleCamera(true)}>
              <IconIon style={styles.icon} name="camera" />
            </Pressable>
            <Pressable
              style={styles.viewIcon}
              onPress={() => {
                toggleKeyboard(this.heightKeyboard);
                toggleImage(this.heightKeyboard);
                Keyboard.dismiss();
              }}>
              <IconIon style={styles.icon2} name="image" />
            </Pressable>
            <View style={styles.viewIcon}>
              <IconIon style={styles.icon2} name="mic" />
            </View>
            <KeyboardListener onWillShow={this.onWillShowKeyboard} />
          </View>
        )}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    width: 140,
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginRight: 5,
  },
  viewIcon: {
    width: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  icon: {
    fontSize: 31,
    color: backgroundIconChat,
    marginBottom: -1.8,
  },
  icon2: {
    fontSize: 27,
    color: backgroundIconChat,
  },
  flexStart: {
    justifyContent: 'flex-start',
  },
});

export default Extension;
