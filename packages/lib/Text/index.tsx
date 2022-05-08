import React, {Component} from 'react';
import {
  PlatformColor,
  Text as TextLibrary,
  TextProps,
  useColorScheme,
} from 'react-native';

const TextFunc = React.forwardRef(
  (
    props: TextProps & {colorModeDark?: string; colorModeLight?: string},
    ref: any,
  ) => {
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
      <TextLibrary ref={ref} style={[{color: colorText}, style]}>
        {children}
      </TextLibrary>
    );
  },
);

class Text extends Component<
  TextProps & {colorModeDark?: string; colorModeLight?: string}
> {
  render() {
    return <TextFunc {...this.props} />;
  }
}

export default Text;
