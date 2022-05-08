import {createContext, useContext} from 'react';
import {Dimensions} from 'react-native';
import {ITheme, theme} from './theme';

export declare type IProviderChat = {
  width: number;
  height: number;
  theme: ITheme;
  colorScheme: 'light' | 'dark';
  toggleCamera: (_flag: boolean) => any;
  toggleKeyboard: (_h: number) => any;
  toggleImage: (_h?: number) => any;
  getHeightKeyboadOpening: () => number;
};

export declare type IImagePickerProvider = {
  album?: any;
  albums?: any;
};

const initValue: IProviderChat = {
  width: Dimensions.get('screen').width,
  height: Dimensions.get('screen').height,
  toggleCamera: (_flag: boolean) => null,
  toggleKeyboard: (_h: number) => null,
  toggleImage: (_h?: number) => null,
  getHeightKeyboadOpening: () => 0,
  theme,
  colorScheme: 'light',
};

const initImagePicker: IImagePickerProvider = {};

export const ProviderChat = createContext(initValue);
export const ImagePickerProvider = createContext(initImagePicker);

export const useProviderChat = () => {
  return useContext(ProviderChat);
};

export const useProviderImagePicker = () => {
  return useContext(ImagePickerProvider);
};
