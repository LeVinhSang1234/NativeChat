import Chat from '@/Chat';
import React from 'react';
import {LogBox} from 'react-native';
import ChatProvider from './packages/ChatProvider';

LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

const App = () => {
  return (
    <ChatProvider>
      <Chat user={{_id: 1}} />
    </ChatProvider>
  );
};

export default App;
