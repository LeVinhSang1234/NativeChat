import React, {Component} from 'react';
import {
  TextInput as InputLibrary,
  TextInputProps,
  useColorScheme,
} from 'react-native';

const TextInputFunc = React.forwardRef((props: TextInputProps, ref: any) => {
  const {style, value, children, ...p} = props;
  const colorScheme = useColorScheme();
  let colorText;
  if (colorScheme === 'dark') {
    colorText = '#fff';
  }
  return (
    <InputLibrary
      ref={ref}
      value={value}
      style={[{color: colorText}, style]}
      {...p}>
      {children}
    </InputLibrary>
  );
});

class TextInput extends Component<TextInputProps> {
  render() {
    return <TextInputFunc {...this.props} />;
  }
}

export default TextInput;
