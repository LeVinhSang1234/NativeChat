import React, {Component} from 'react';
import {GestureResponderEvent, Pressable, StyleSheet} from 'react-native';

interface IProps {
  onTab?: (event: GestureResponderEvent) => any;
  onDoubleTab?: (event: GestureResponderEvent) => any;
  onLongTab?: (event: GestureResponderEvent) => any;
  onMove?: (x: number, y: number) => any;
  wait?: number;
}

class TabClickHandle extends Component<IProps> {
  timeout?: NodeJS.Timeout;
  touchXY: {x: number; y: number; yStart: number; xStart: number};
  isZoom: boolean;
  identifier: number;

  constructor(props: IProps) {
    super(props);
    this.touchXY = {x: 0, y: 0, xStart: 0, yStart: 0};
    this.isZoom = false;
    this.identifier = 1;
  }

  handlePress = (event: GestureResponderEvent) => {
    if (this.isZoom) {
      this.isZoom = false;
      return;
    }
    if (this.identifier >= 2) {
      return;
    }
    event.persist();
    const {onDoubleTab, onTab, wait = 200} = this.props;
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
      return onDoubleTab?.(event);
    }
    this.timeout = setTimeout(() => {
      this.timeout = undefined;
      onTab?.(event);
    }, wait);
  };

  handleStart = ({nativeEvent}: GestureResponderEvent) => {
    const {pageX, pageY, identifier} = nativeEvent;
    this.touchXY = {x: pageX, y: pageY, xStart: pageX, yStart: pageY};
    this.identifier = Number(identifier);
  };

  handleTouchMove = (event: GestureResponderEvent) => {
    const {onMove} = this.props;
    const {nativeEvent} = event;
    const {pageX, pageY} = nativeEvent;
    if (this.identifier >= 2) {
      return;
    }
    if (Math.abs(pageY - this.touchXY.yStart) > 25) {
      this.isZoom = true;
      onMove?.(pageX - this.touchXY.x, pageY - this.touchXY.y);
    }
    this.touchXY = {...this.touchXY, x: pageX, y: pageY};
  };

  render() {
    const {children, onLongTab} = this.props;
    return (
      <Pressable
        style={styles.view}
        onLongPress={onLongTab}
        onPress={this.handlePress}
        onTouchStart={this.handleStart}
        onTouchMove={this.handleTouchMove}>
        {children}
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    position: 'relative',
  },
});

export default TabClickHandle;
