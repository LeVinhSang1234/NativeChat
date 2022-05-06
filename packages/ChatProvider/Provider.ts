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
};

const initValue: IProviderChat = {
  width: Dimensions.get('screen').width,
  height: Dimensions.get('screen').height,
  toggleCamera: (_flag: boolean) => null,
  toggleKeyboard: (_h: number) => null,
  theme,
  colorScheme: 'light',
};

export const ProviderChat = createContext(initValue);

export const useProviderChat = () => {
  return useContext(ProviderChat);
};
