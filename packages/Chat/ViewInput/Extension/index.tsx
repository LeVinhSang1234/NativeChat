import {IProviderChat} from '@/ChatProvider/Provider';
import {IconIon} from '@/utils';
import {backgroundIconChat} from '@/utils/variables';
import React, {Component} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

interface IProps {
  handleBlurInput: () => any;
  provider: IProviderChat;
  visibleChevron: boolean;
  openImageSelect: (f: boolean) => any;
}

interface IState {}

class Extension extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {visibleChevron: false};
  }

  shouldComponentUpdate(_nProps: IProps) {
    const {visibleChevron} = this.props;
    return visibleChevron !== _nProps.visibleChevron;
  }

  render() {
    const {handleBlurInput, provider, visibleChevron, openImageSelect} =
      this.props;
    return (
      <View style={styles.view}>
        <Pressable
          style={styles.pressable}
          onPress={() => provider.toggleCamera(true)}>
          <IconIon style={styles.iconCamera} name="camera" />
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={() => openImageSelect(true)}>
          <IconIon style={styles.iconImage} name="image" />
        </Pressable>
        <Pressable style={styles.pressable}>
          <IconIon style={styles.iconMic} name="mic" />
        </Pressable>
        {visibleChevron ? (
          <Pressable style={styles.pressableChevron} onPress={handleBlurInput}>
            <IconIon style={styles.iconImage} name="chevron-forward" />
          </Pressable>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 3,
  },
  iconCamera: {
    fontSize: 31.8,
    color: backgroundIconChat,
    marginBottom: -1.2,
  },
  iconImage: {
    fontSize: 28,
    color: backgroundIconChat,
    paddingLeft: 5,
  },
  iconMic: {
    fontSize: 28,
    color: backgroundIconChat,
  },
  pressable: {
    width: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pressableChevron: {
    width: 45,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default Extension;
