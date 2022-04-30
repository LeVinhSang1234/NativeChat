import React from 'react';
import {Text as TextLibrary, TextProps, useColorScheme} from 'react-native';

function Text(props: TextProps) {
  const {children, style} = props;
  const colorScheme = useColorScheme();
  let colorText;
  if (colorScheme === 'dark') {
    colorText = '#fff';
  }
  return (
    <TextLibrary style={[{color: colorText}, style]}>{children}</TextLibrary>
  );
}

export default Text;
