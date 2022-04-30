import deviceInfoModule from 'react-native-device-info';
import {Platform, StatusBar} from 'react-native';

const height = Platform.select({
  ios: deviceInfoModule.hasNotch() ? 44 : 29,
  android: StatusBar.currentHeight,
  default: 0,
});
const bottomHeight = deviceInfoModule.hasNotch() ? 34 : Platform.isPad ? 10 : 5;
export default {
  height,
  bottomHeight,
  windowHeight: height + bottomHeight,
  topHeight: height,
  isPad: Platform.isPad,
  isTouch: deviceInfoModule.hasNotch(),
};
