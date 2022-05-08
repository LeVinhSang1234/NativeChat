import {
  backgroundChatDark,
  backgroundChatLight,
  backgroundIconChat,
} from '@/utils/variables';
import {TextStyle, ViewStyle} from 'react-native';

export declare type ITheme = {
  chatBody?: {
    imageBackground?: {
      uri: string;
    };
    backgroundColor?: string;
  };
  textLibrary?: {
    CameraPermission: string;
    CameraPermissionDescription: string;
    openSettingApp: string;
  };
  inputChat?: {
    light: TextStyle;
    dark: TextStyle;
    placeholderTextColor?: string;
    style?: TextStyle;
  };
  avoidingView?: ViewStyle;
  iconCamera?: TextStyle;
  iconMic?: TextStyle;
  iconImage?: TextStyle;
  bottomImage?: {
    header: {
      style?: ViewStyle;
      button?: {
        cancel?: {
          style?: TextStyle;
          text?: string;
          pressable?: ViewStyle;
        };
        album?: {
          style?: TextStyle;
          text?: string;
          pressable?: ViewStyle;
        };
        middleAlbum?: {
          album?: TextStyle;
          albumDescription?: TextStyle;
          pressable?: ViewStyle;
        };
      };
    };
  };
};

export const theme: ITheme = {
  textLibrary: {
    CameraPermission:
      'Bật quyền truy cập vào camera trong phần cài đặt thiết bị',
    CameraPermissionDescription:
      'NativeChat dùng camera của thiết bị để bạn có thể làm những việc như chụp ảnh, quay và phát video.',
    openSettingApp: 'Đi tới cài đặt',
  },
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bottomImage: {
    header: {
      style: {
        height: 30,
      },
      button: {
        cancel: {
          style: {color: backgroundIconChat, fontWeight: '600'},
          pressable: {
            width: 70,
            height: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 10,
          },
        },
        album: {
          style: {color: backgroundIconChat, fontWeight: '600'},
          pressable: {
            width: 70,
            height: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 10,
          },
        },
      },
    },
  },
};
