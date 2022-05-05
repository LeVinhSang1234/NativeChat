import Chat from '@/Chat';
import React from 'react';
import ChatProvider from './packages/ChatProvider';

const App = () => {
  return (
    <ChatProvider>
      <Chat user={{_id: 1}} />
    </ChatProvider>
  );
};

export default App;
