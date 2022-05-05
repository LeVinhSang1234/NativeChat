import Text from '@/lib/Text';
import {IconIon} from '@/utils';
import {backgroundIconChat} from '@/utils/variables';
import React, {Component} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

interface IExtensionProps {
  animated: Animated.Value;
}

class Extension extends Component<IExtensionProps> {
  render() {
    const {animated} = this.props;

    return (
      <Animated.View style={[styles.view]}>
        <View style={[styles.viewIcon, styles.flexStart]}>
          <IconIon style={styles.icon} name="camera" />
        </View>
        <View style={styles.viewIcon}>
          <IconIon style={styles.icon2} name="image" />
        </View>
        <View style={styles.viewIcon}>
          <IconIon style={styles.icon2} name="mic" />
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    width: 140,
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 5,
  },
  viewIcon: {
    width: 45,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 31,
    color: backgroundIconChat,
    marginBottom: 1.5,
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
