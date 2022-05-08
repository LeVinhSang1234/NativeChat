import React from 'react';
import {
  PlatformColor,
  Text as TextLibrary,
  TextProps,
  useColorScheme,
} from 'react-native';

function Text(
  props: TextProps & {colorModeDark?: string; colorModeLight?: string},
) {
  const {
    children,
    style,
    colorModeDark = PlatformColor?.('label') || '#fff',
    colorModeLight = PlatformColor?.('label') || '#000',
  } = props;
  const colorScheme = useColorScheme();
  let colorText = colorModeDark;
  if (colorScheme === 'light') {
    colorText = colorModeLight;
  }
  return (
    <TextLibrary style={[{color: colorText}, style]}>{children}</TextLibrary>
  );
}

export default Text;
