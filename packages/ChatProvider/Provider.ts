import {createContext, useContext} from 'react';
import {Dimensions} from 'react-native';

export const ProviderChat = createContext({
  width: Dimensions.get('screen').width,
  height: Dimensions.get('screen').height,
  toggleCamera: (_flag: boolean) => {},
});

export const useProviderChat = () => {
  return useContext(ProviderChat);
};
