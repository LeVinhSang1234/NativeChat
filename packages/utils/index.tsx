import {Animated, Platform} from 'react-native';
import IconIon from 'react-native-vector-icons/Ionicons';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import IconSomeWhere from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
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
  OcticonsIcon,
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
