import React from 'react';
import {Text as TextLibrary, TextProps, useColorScheme} from 'react-native';

function Text(
  props: TextProps & {colorModeDark?: string; colorModeLight?: string},
) {
  const {
    children,
    style,
    colorModeDark = '#fff',
    colorModeLight = '#000',
  } = props;
  const colorScheme = useColorScheme();
  let colorText = colorModeDark;
  if (colorScheme === 'dark') {
    colorText = colorModeLight;
  }
  return (
    <TextLibrary style={[{color: colorText}, style]}>{children}</TextLibrary>
  );
}

export default Text;
