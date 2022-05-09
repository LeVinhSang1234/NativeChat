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
};

export const theme: ITheme = {
  textLibrary: {
    CameraPermission:
      'Bật quyền truy cập vào camera trong phần cài đặt thiết bị',
    CameraPermissionDescription:
      'NativeChat dùng camera của thiết bị để bạn có thể làm những việc như chụp ảnh, quay và phát video.',
    openSettingApp: 'Đi tới cài đặt',
  },
};
