import {ProviderChat} from '@/ChatProvider/Provider';
import React, {Component} from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';

interface IBottomImageProps {}

class BottomImage extends Component<IBottomImageProps> {
  animatedHeight: Animated.Value;
  constructor(props: IBottomImageProps) {
    super(props);
    this.animatedHeight = new Animated.Value(0);
  }

  toggleImage = (h: number = 0) => {
    Animated.timing(this.animatedHeight, {
      toValue: h,
      duration: 0,
      useNativeDriver: false,
    }).start();
  };

  render() {
    return (
      <ProviderChat.Consumer>
        {({colorScheme}) => {
          const shadowColor = colorScheme === 'dark' ? '#fff' : '#000';
          const backgroundColor = colorScheme === 'dark' ? '#000' : '#fff';
          return (
            <Animated.View
              style={[
                styles.view,
                {shadowColor, backgroundColor, height: this.animatedHeight},
              ]}>
              <Pressable
                // onTouchEnd={() => this.handlePress(toggleKeyboard)}
                // onTouchMove={e => this.handleTouchMove(e, toggleKeyboard)}
                style={styles.wrapDrag}>
                <View style={[styles.lineDrag]} />
              </Pressable>
            </Animated.View>
          );
        }}
      </ProviderChat.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.215,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  wrapDrag: {
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  lineDrag: {
    height: 5,
    marginVertical: 5,
    width: 60,
    backgroundColor: '#e3e3e3',
    borderRadius: 100,
  },
});

export default BottomImage;
