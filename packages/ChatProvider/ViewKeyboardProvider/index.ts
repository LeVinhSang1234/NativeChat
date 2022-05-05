import {createContext, useContext} from 'react';

export declare type IProviderKeyboardView = {
  toggleKeyboard: (_height: number, callback?: () => any) => any;
};

const initValue: IProviderKeyboardView = {
  toggleKeyboard: (_height: number) => null,
};

export const ProviderKeyboardView = createContext(initValue);

export const useProviderKeyboardView = () => {
  return useContext(ProviderKeyboardView);
};
