import {Animated, Platform} from 'react-native';
import IconIon from 'react-native-vector-icons/Ionicons';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import IconSomeWhere from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import IconSomeWherePro from 'react-native-vector-icons/FontAwesome5Pro';
import RNConvertPhAsset from 'react-native-convert-ph-asset';
import RNPhotosFramework from 'rn-photos-framework';

export {
  IconIon,
  IconSomeWhere,
  RNConvertPhAsset,
  MaterialIcons,
  IconSomeWherePro,
  IconEvilIcons,
  OcticonsIcon,
  RNPhotosFramework,
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

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function random(length: number = 16) {
  let result = '';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

let timeout: any = {};
function makeidDebounce(number: number = 16): string {
  const id = random(number);
  if (timeout[id]) {
    return makeidDebounce(number);
  }
  return id;
}

export function debounce(func: Function, duration: number = 0): () => any {
  const id = makeidDebounce(26);
  return () => {
    if (timeout[id]) {
      clearTimeout(timeout[id]);
      delete timeout[id];
    }
    timeout[id] = setTimeout(() => {
      delete timeout[id];
      func();
    }, duration);
  };
}
