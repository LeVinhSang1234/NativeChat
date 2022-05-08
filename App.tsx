import Chat from '@/Chat';
import React from 'react';
import {SafeAreaView} from 'react-native';
import ChatProvider from './packages/ChatProvider';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ChatProvider>
        <Chat user={{_id: 1}} />
      </ChatProvider>
    </SafeAreaView>
  );
};

export default App;
