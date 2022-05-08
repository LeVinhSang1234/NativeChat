import React from 'react';
import {
  TextInput as InputLibrary,
  TextInputProps,
  useColorScheme,
} from 'react-native';

function TextInput(props: TextInputProps) {
  const {style, value, children, ...p} = props;
  const colorScheme = useColorScheme();
  let colorText;
  if (colorScheme === 'dark') {
    colorText = '#fff';
  }
  return (
    <InputLibrary value={value} style={[{color: colorText}, style]} {...p}>
      {children}
    </InputLibrary>
  );
}

export default TextInput;
