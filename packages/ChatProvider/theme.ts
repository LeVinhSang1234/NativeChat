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
  textPhotos?: {
    photoPermission: string;
    photoPermissionDescription: string;
    photoPermissionButton: string;
    gotoSetting: string;
    albumDescription: string;
  };
  common?: {
    button: {
      cancel: string;
      album: string;
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
  textPhotos: {
    photoPermission: 'Quyền truy cập vào ảnh và video của bạn',
    photoPermissionDescription:
      'Cho phép NativeChat truy cập vào ảnh và video để bạn có thể chia sẻ với bạn bè',
    photoPermissionButton: 'Cho phép truy cập',
    gotoSetting: 'Đi tới cài đặt',
    albumDescription: 'Đến Tiểu Snow',
  },
  common: {
    button: {
      cancel: 'Huỷ',
      album: 'Album',
    },
  },
};
