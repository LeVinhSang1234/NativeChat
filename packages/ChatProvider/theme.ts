import bar from '@/utils/bar';
import {backgroundInputChat} from '@/utils/variables';
import {TextStyle, ViewStyle} from 'react-native';

export declare type ITheme = {
  chatBody?: {
    imageBackground?: {
      uri: string;
    };
    backgroundColor?: string;
  };
  inputChat?: TextStyle;
  avoidingView?: ViewStyle;
};

export const theme: ITheme = {
  inputChat: {
    minHeight: 36,
    backgroundColor: backgroundInputChat,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 14,
  },
  avoidingView: {
    minHeight: bar.bottomHeight + 46,
    paddingBottom: bar.bottomHeight + 10,
    paddingTop: 10,
  },
};
