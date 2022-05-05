import bar from '@/utils/bar';
import {backgroundChatDark, backgroundChatLight} from '@/utils/variables';
import {TextStyle, ViewStyle} from 'react-native';

export declare type ITheme = {
  chatBody?: {
    imageBackground?: {
      uri: string;
    };
    backgroundColor?: string;
  };
  inputChat?: {
    light: TextStyle;
    dark: TextStyle;
    placeholderTextColor?: string;
    style?: TextStyle;
  };
  avoidingView?: ViewStyle;
};

export const theme: ITheme = {
  inputChat: {
    light: {
      backgroundColor: backgroundChatLight,
    },
    dark: {
      backgroundColor: backgroundChatDark,
      color: '#fff',
    },
    style: {
      minHeight: 36,
      borderRadius: 20,
      fontSize: 14,
      paddingHorizontal: 12,
      paddingTop: 10,
      paddingBottom: 10,
      maxHeight: 150,
      textAlignVertical: 'center',
    },
    placeholderTextColor: '#6e6e6e',
  },
  avoidingView: {
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
};
