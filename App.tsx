import Chat from '@/Chat';
import bar from '@/utils/bar';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import ChatProvider from './packages/ChatProvider';

const App = () => {
  return (
    <SafeAreaView style={styles.view}>
      <ChatProvider keyboardDistance={bar.bottomHeight}>
        <Chat user={{_id: 1}} />
      </ChatProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

export default App;
