import React, {Component} from 'react';
import {useColorScheme} from 'react-native';
import {
  BlurView as BlurLibrary,
  BlurViewProperties,
} from '@react-native-community/blur';

const BlurViewFunc = React.forwardRef(
  (props: BlurViewProperties & {children?: any}, ref: any) => {
    const {style, children, blurType, ...p} = props;
    const colorScheme = useColorScheme();
    return (
      <BlurLibrary
        ref={ref}
        blurType={blurType || colorScheme || 'light'}
        style={style}
        {...p}>
        {children}
      </BlurLibrary>
    );
  },
);

class BlurView extends Component<BlurViewProperties> {
  render() {
    return <BlurViewFunc {...this.props} />;
  }
}

export default BlurView;
