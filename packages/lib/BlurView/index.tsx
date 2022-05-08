import React from 'react';
import {useColorScheme} from 'react-native';
import {
  BlurView as BlurLibrary,
  BlurViewProperties,
} from '@react-native-community/blur';

function BlurView(props: BlurViewProperties & {children: any}) {
  const {style, children, blurType} = props;
  const colorScheme = useColorScheme();
  return (
    <BlurLibrary blurType={blurType || colorScheme || 'light'} style={style}>
      {children}
    </BlurLibrary>
  );
}

export default BlurView;
