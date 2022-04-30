import {Animated, Platform} from 'react-native';
import IconIon from 'react-native-vector-icons/Ionicons';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import IconSomeWhere from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconSomeWherePro from 'react-native-vector-icons/FontAwesome5Pro';
import Video from 'react-native-video';
import RNConvertPhAsset from 'react-native-convert-ph-asset';

export {
  IconIon,
  IconSomeWhere,
  Video,
  RNConvertPhAsset,
  MaterialIcons,
  IconSomeWherePro,
  IconEvilIcons,
};

export const appConnect: {language: string} = {
  language: '',
};

export async function throwException(e: any) {
  console.log(e);
}

export const convertUri = (uri: string) => {
  if (Platform.OS === 'android') {
    return uri;
  }
  return decodeURIComponent(uri.replace('file://', ''));
};

export function animatedSpringLayout(
  animated: any,
  value: any,
  nativeDriver?: boolean,
) {
  return Animated.spring(animated, {
    toValue: value,
    bounciness: 1,
    overshootClamping: true,
    useNativeDriver: !!nativeDriver,
  });
}

export function animatedSpring(
  animated: any,
  value: any,
  nativeDriver?: boolean,
) {
  return Animated.spring(animated, {
    toValue: value,
    useNativeDriver: !!nativeDriver,
  });
}

export function animatedTiming(
  animated: any,
  {
    toValue = 0,
    duration = 0,
    nativeDrive = false,
    easing,
    delay = 0,
  }: {
    toValue: any;
    duration?: number;
    nativeDrive?: boolean;
    easing?: (value: number) => number;
    delay?: number;
  },
) {
  const objectConfig: any = {
    toValue,
    useNativeDriver: nativeDrive,
    duration,
    delay,
  };
  if (easing) {
    objectConfig.easing = easing;
  }
  return Animated.timing(animated, objectConfig);
}
