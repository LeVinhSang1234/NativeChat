import {createContext, useContext} from 'react';
import {Dimensions} from 'react-native';
import {ITheme, theme} from './theme';

export declare type IProviderChat = {
  width: number;
  height: number;
  theme: ITheme;
  colorScheme: 'light' | 'dark';
  toggleCamera: (_flag: boolean) => any;
  toggleImage: (height: number) => any;
  iconFastSend?: string;
};

const initValue: IProviderChat = {
  width: Dimensions.get('screen').width,
  height: Dimensions.get('screen').height,
  toggleCamera: (_flag: boolean) => null,
  toggleImage: (_flag: number) => null,
  theme,
  colorScheme: 'light',
  iconFastSend: '',
};

export const ProviderChat = createContext(initValue);

export const useProviderChat = () => {
  return useContext(ProviderChat);
};
