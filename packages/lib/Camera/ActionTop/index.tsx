import {ProviderChat} from '@/ChatProvider/Provider';
import {IconIon} from '@/utils';
import bar from '@/utils/bar';
import React, {Component, Fragment} from 'react';
import {StyleSheet, Text, Pressable, View} from 'react-native';
import {FlashMode, RNCamera} from 'react-native-camera';

interface IProps {
  flashMode: keyof FlashMode;
  onClose: () => any;
  onChangeType: () => any;
  onChangeFlash: () => any;
}

class ActionTop extends Component<IProps> {
  shouldComponentUpdate(nProps: IProps) {
    const {flashMode} = this.props;
    return flashMode !== nProps.flashMode;
  }

  renderNameFlash = () => {
    const {flashMode} = this.props;
    if (flashMode !== RNCamera.Constants.FlashMode.off) {
      return 'ios-flash';
    }
    return 'ios-flash-off';
  };
  render() {
    const {onClose, onChangeType, onChangeFlash, flashMode} = this.props;
    return (
      <ProviderChat.Consumer>
        {({width}) => (
          <Fragment>
            <Pressable onPress={onClose} style={styles.iconClose}>
              <IconIon name="ios-close" size={30} color="#fff" />
            </Pressable>
            <View style={[styles.iconChangeCamera, {left: width / 2 - 40}]}>
              <View style={styles.flash}>
                <Pressable onPress={onChangeType}>
                  <View style={styles.viewCameraReverse}>
                    <IconIon name="ios-camera-reverse" size={30} color="#fff" />
                  </View>
                </Pressable>
                <Pressable onPress={onChangeFlash}>
                  <View style={styles.viewCameraReverse}>
                    <View style={[styles.mt2]}>
                      <IconIon
                        name={this.renderNameFlash()}
                        size={24}
                        color="#fff"
                      />
                    </View>
                    {flashMode === RNCamera.Constants.FlashMode.auto ? (
                      <Text style={styles.textAFlash}>A</Text>
                    ) : null}
                  </View>
                </Pressable>
              </View>
            </View>
          </Fragment>
        )}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  iconClose: {
    position: 'absolute',
    top: bar.isTouch ? bar.topHeight : 10,
    left: 15,
    zIndex: 1000,
    width: 30,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2.5,
  },
  iconChangeCamera: {
    position: 'absolute',
    top: bar.isTouch ? bar.topHeight : 13,
    zIndex: 2,
    width: 100,
    height: 30,
    flexDirection: 'row',
  },
  flash: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
  },
  textAFlash: {
    position: 'absolute',
    bottom: 4,
    right: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewCameraReverse: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 40,
    height: 40,
  },
  mt2: {
    marginTop: 2,
  },
});

export default ActionTop;
