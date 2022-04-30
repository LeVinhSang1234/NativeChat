import {ProviderChat} from '@/ChatProvider/Provider';
import {animatedTiming, IconIon} from '@/utils';
import React, {Component} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

interface IProps {
  xPoint: number;
  yPoint: number;
  exposure: number;
}

const heightLine = 120;

class FocusPoint extends Component<IProps> {
  animatedLine: Animated.Value;
  animatedView: Animated.Value;
  animatedScale: Animated.Value;
  constructor(props: IProps) {
    super(props);
    this.animatedLine = new Animated.Value(0);
    this.animatedView = new Animated.Value(0);
    this.animatedScale = new Animated.Value(1.4);
  }

  shouldComponentUpdate(nProps: IProps) {
    const {xPoint, yPoint, exposure} = this.props;
    return (
      xPoint !== nProps.xPoint ||
      yPoint !== nProps.yPoint ||
      exposure !== nProps.exposure
    );
  }

  getHeightLine2 = () => {
    const {exposure} = this.props;
    if (exposure === -1 || exposure === 0.5) {
      return heightLine / 2;
    }
    return heightLine * exposure;
  };

  getHeightLine1 = () => {
    const {exposure} = this.props;
    if (exposure === -1 || exposure === 0.5) {
      return heightLine / 2;
    }
    return heightLine * (1 - exposure);
  };

  handleAnimatedShow = () => {
    animatedTiming(this.animatedLine, {
      toValue: 1,
      duration: 100,
      nativeDrive: true,
    }).start();
  };

  handleAnimatedLineShow = () => {
    this.animatedScale.setValue(1);
    Animated.parallel([
      animatedTiming(this.animatedView, {
        toValue: 1,
        duration: 0,
        nativeDrive: true,
      }),
      animatedTiming(this.animatedLine, {
        toValue: 1,
        duration: 0,
        nativeDrive: true,
      }),
    ]).start(({finished: f}) => {
      if (f) {
        this.handleAnimatedViewShowDown();
      }
    });
  };

  handleAnimatedViewShow = () => {
    this.animatedScale.setValue(1.6);
    Animated.parallel([
      animatedTiming(this.animatedView, {
        toValue: 1,
        duration: 0,
        nativeDrive: true,
      }),
      animatedTiming(this.animatedScale, {
        toValue: 1,
        duration: 100,
        nativeDrive: true,
      }),
    ]).start(({finished: f}) => {
      if (f) {
        this.handleAnimatedViewShowDown();
      }
    });
  };

  handleAnimatedViewShowDown = () => {
    animatedTiming(this.animatedView, {
      toValue: 0.3,
      duration: 100,
      delay: 4000,
      nativeDrive: true,
    }).start(({finished}) => {
      if (finished) {
        this.handleAnimatedViewHide();
      }
    });
  };

  handleAnimatedViewHide = () => {
    Animated.parallel([
      animatedTiming(this.animatedView, {
        toValue: 0,
        duration: 0,
        delay: 4000,
        nativeDrive: true,
      }),
      animatedTiming(this.animatedScale, {
        toValue: 1.6,
        duration: 0,
        nativeDrive: true,
        delay: 4000,
      }),
      animatedTiming(this.animatedLine, {
        toValue: 0,
        duration: 0,
        nativeDrive: true,
      }),
    ]).start();
  };

  handleAnimatedViewHideNow = (callback: () => any) => {
    Animated.parallel([
      animatedTiming(this.animatedView, {
        toValue: 0,
        duration: 0,
        nativeDrive: true,
      }),
      animatedTiming(this.animatedScale, {
        toValue: 1.6,
        duration: 0,
        nativeDrive: true,
      }),
      animatedTiming(this.animatedLine, {
        toValue: 0,
        duration: 100,
        nativeDrive: true,
      }),
    ]).start(({finished}) => {
      if (finished) {
        callback?.();
      }
    });
  };

  render() {
    const {xPoint, yPoint} = this.props;
    const styleLine = yPoint < 0.2 ? {left: -30} : {right: -30};
    return (
      <ProviderChat.Consumer>
        {({width, height}) => (
          <Animated.View
            style={[
              styles.view,
              {
                left: (1 - yPoint) * width - 35,
                top: xPoint * height - 35,
                opacity: this.animatedView,
                transform: [{scale: this.animatedScale}],
              },
            ]}>
            <View style={styles.relative}>
              <Animated.View style={[styles.viewChild]}>
                <View style={styles.child1} />
                <View style={styles.child2} />
                <View style={styles.child3} />
                <View style={styles.child4} />
              </Animated.View>
              <View style={[styles.viewLight, styleLine]}>
                <Animated.View
                  style={[
                    styles.line1,
                    {
                      height: this.getHeightLine1(),
                      opacity: this.animatedLine,
                    },
                  ]}
                />
                <View style={styles.viewIcon}>
                  <IconIon color="yellow" name="sunny" size={20} />
                </View>
                <Animated.View
                  style={[
                    styles.line2,
                    {
                      height: this.getHeightLine2(),
                      opacity: this.animatedLine,
                    },
                  ]}
                />
              </View>
            </View>
          </Animated.View>
        )}
      </ProviderChat.Consumer>
    );
  }
}

export default FocusPoint;

const styles = StyleSheet.create({
  view: {
    width: 70,
    height: 70,
    position: 'absolute',
  },
  relative: {
    position: 'relative',
  },
  viewChild: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderColor: 'yellow',
    borderWidth: 0.7,
  },
  child1: {
    position: 'absolute',
    width: 1,
    height: 5,
    backgroundColor: 'yellow',
    left: '50%',
    top: 0,
  },
  child2: {
    position: 'absolute',
    width: 1,
    height: 5,
    backgroundColor: 'yellow',
    left: '50%',
    bottom: 0,
  },
  child3: {
    position: 'absolute',
    width: 5,
    height: 1,
    backgroundColor: 'yellow',
    left: 0,
    bottom: '50%',
  },
  child4: {
    position: 'absolute',
    width: 5,
    height: 1,
    backgroundColor: 'yellow',
    right: 0,
    bottom: '50%',
  },
  viewLight: {
    position: 'absolute',
    height: 120,
    width: 21,
    top: -38.5,
  },
  lineLight: {
    position: 'absolute',
  },
  line1: {
    height: 15,
    width: 0.7,
    marginLeft: 9,
    backgroundColor: 'yellow',
  },
  line2: {
    height: 15,
    width: 0.7,
    marginLeft: 9,
    backgroundColor: 'yellow',
  },
  viewIcon: {
    width: 21,
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
