import { SafeAreaView, Text, View } from 'react-native';
import React from 'react';
import Header from '../components/Header';
import ChatList from '../components/ChatList';

const Chatscreen = () => {
  return (
    <SafeAreaView>
      <Header title="Chat" />
      <ChatList />
    </SafeAreaView>
  );
};

export default Chatscreen;
