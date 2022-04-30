import Chat from '@/Chat';
import React from 'react';
import ChatProvider from './packages/ChatProvider';

const App = () => {
  return (
    <ChatProvider>
      <Chat />
    </ChatProvider>
  );
};

export default App;
