import {createContext, useContext} from 'react';
import {Dimensions, Platform} from 'react-native';
import {ITheme, theme} from './theme';

export declare type IProviderChat = {
  width: number;
  height: number;
  theme: ITheme;
  colorScheme: 'light' | 'dark';
  toggleCamera: (flag: boolean) => any;
  removeKeyboard: () => any;
  isOpenKeyboard: () => {
    heightKeyboard: number;
    duration: number;
    keyboardHeightSystem: number;
    isKeyboardOpen: boolean;
    heightInput: number;
  };
  type: 'portrait' | 'landscape';
};

export declare type IKeyboardProvider = {
  openKeyboard: () => any;
  removeKeyboard: () => any;
  dragKeyboard: (h: number) => any;
  keyboardHeight: number;
  keyboardHeightSystem: number;
  heightStartInit: number;
  isKeyboardOpen: boolean;
  durationKeyboard: number;
};

export declare type IImagePickerProvider = {
  album?: any;
  albums?: any;
};

const initValue: IProviderChat = {
  width: Dimensions.get('screen').width,
  height: Dimensions.get('screen').height,
  toggleCamera: (_flag: boolean) => null,
  theme,
  colorScheme: 'light',
  type:
    Dimensions.get('screen').width > Dimensions.get('screen').height
      ? 'landscape'
      : 'portrait',
  removeKeyboard: () => null,
  isOpenKeyboard: () => ({
    heightKeyboard: 0,
    duration: 0,
    keyboardHeightSystem: 250,
    isKeyboardOpen: false,
    heightInput: 0,
  }),
};

const initImagePicker: IImagePickerProvider = {};

const initialValueKeyboard: IKeyboardProvider = {
  keyboardHeight: 250,
  keyboardHeightSystem: 250,
  heightStartInit: 0,
  isKeyboardOpen: false,
  openKeyboard: () => null,
  removeKeyboard: () => null,
  dragKeyboard: (_h: number) => null,
  durationKeyboard: Platform.select({ios: 250, default: 10}),
};

export const ProviderChat = createContext(initValue);
export const ProviderImagePicker = createContext(initImagePicker);
export const ProviderKeyboard = createContext(initialValueKeyboard);

export const useProviderChat = () => {
  return useContext(ProviderChat);
};

export const useProviderImagePicker = () => {
  return useContext(ProviderImagePicker);
};

export const useProviderKeyboard = () => {
  return useContext(ProviderKeyboard);
};
