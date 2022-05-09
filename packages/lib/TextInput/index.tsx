import React, {Component} from 'react';
import {
  Animated,
  TextInput as InputLibrary,
  TextInputProps,
  useColorScheme,
} from 'react-native';

const TextInput = React.forwardRef((props: TextInputProps, ref: any) => {
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

class TextInputComponent extends Component<TextInputProps> {
  render() {
    return <TextInput {...this.props} />;
  }
}

const TextInputAnimated = Animated.createAnimatedComponent(TextInputComponent);

export {TextInputAnimated};

export default TextInput;
