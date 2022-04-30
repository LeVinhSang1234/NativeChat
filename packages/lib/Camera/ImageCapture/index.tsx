import {ProviderChat} from '@/ChatProvider/Provider';
import {convertUri, IconIon, IconSomeWhere, MaterialIcons} from '@/utils';
import bar from '@/utils/bar';
import {dark} from '@/utils/variables';
import React, {Component} from 'react';
import {Image, StyleSheet, Text, Pressable, View} from 'react-native';

interface IProps {
  image: any;
  onClose: () => any;
  saveText?: string;
  sendText?: string;
}

class ImageCapture extends Component<IProps> {
  rotateImage = (exifOrientation: number) => {
    let degRotation;
    switch (exifOrientation) {
      case 3:
        degRotation = '360deg';
        break;
      case 4:
        degRotation = '360deg';
        break;
      case 5:
        degRotation = '90deg';
        break;
      case 6:
        degRotation = '90deg';
        break;
      case 7:
        degRotation = '270deg';
        break;
      case 8:
        degRotation = '270deg';
        break;
      default:
        degRotation = '0deg';
    }
    return degRotation;
  };

  render() {
    const {image, onClose, saveText = 'Save', sendText = 'Send'} = this.props;
    return (
      <ProviderChat.Consumer>
        {({width, height}) => (
          <View style={[styles.view, {width, height}]}>
            <Image
              style={[
                styles.view,
                {
                  width,
                  height,
                  transform: [
                    {rotate: this.rotateImage(image.deviceOrientation)},
                  ],
                },
              ]}
              source={{uri: convertUri(image.uri)}}
              resizeMode="contain"
            />
            <Pressable onPress={onClose}>
              <View style={styles.iconClose}>
                <IconIon name="chevron-back" size={30} color="#fff" />
              </View>
            </Pressable>
            <Pressable>
              <View style={styles.buttonSave}>
                <View style={styles.flexCenter}>
                  <IconSomeWhere
                    size={16}
                    name="long-arrow-down"
                    color="#fff"
                  />
                </View>
                <View style={styles.flexCenter}>
                  <View style={styles.viewLineDown} />
                </View>
                <Text style={styles.textSave}>{saveText}</Text>
              </View>
            </Pressable>
            <Pressable>
              <View style={styles.buttonSend}>
                <Text style={styles.textSend}>{sendText}</Text>
                <MaterialIcons color="#fff" size={16} name="send" />
              </View>
            </Pressable>
          </View>
        )}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: dark,
    flex: 1,
    overflow: 'hidden',
  },
  iconClose: {
    position: 'absolute',
    top: bar.isTouch ? bar.topHeight : 10,
    left: 15,
    zIndex: 2,
    width: 30,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2.5,
  },
  buttonSave: {
    position: 'absolute',
    bottom: bar.bottomHeight || 18,
    left: 30,
  },
  buttonSend: {
    position: 'absolute',
    bottom: bar.bottomHeight || 28,
    right: 20,
    backgroundColor: '#4a87ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  textSend: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },
  flexCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textSave: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  viewLineDown: {
    backgroundColor: '#fff',
    height: 2,
    width: 17,
    marginTop: 3,
    marginBottom: 10,
    marginRight: 1,
  },
});

export default ImageCapture;
