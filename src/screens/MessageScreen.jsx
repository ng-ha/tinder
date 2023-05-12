import { useRoute } from '@react-navigation/native';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Header from '../components/Header';
import ReceiverMessage from '../components/ReceiverMessage';
import SenderMessage from '../components/SenderMessage';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';

const MessageScreen = () => {
  const { user } = useAuth();
  const { params } = useRoute();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const { matchDetails } = params;
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'matches', matchDetails.id, 'messages'), orderBy('timestamp', 'desc')),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [matchDetails, db]
  );
  const sendMessage = () => {
    addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: matchDetails.users[user.uid].displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
    });
    setInput('');
  };
  return (
    <SafeAreaView className="flex-1">
      <Header callEnable title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            data={messages}
            className="pl-4"
            keyExtractor={(item) => item.id}
            inverted={-1}
            renderItem={({ item }) =>
              item.userId === user.uid ? (
                <SenderMessage key={item.id} message={item} />
              ) : (
                <ReceiverMessage key={item.id} message={item} />
              )
            }
          />
        </TouchableWithoutFeedback>
        <View className="flex-row justify-between items-center border-t border-gray-200 px-5 py-2">
          <TextInput
            className="h-10 text-lg"
            placeholder="Send Message..."
            onChangeText={setInput}
            value={input}
            onSubmitEditing={sendMessage}
          />
          <Button onPress={sendMessage} title="Send" color="#FF5864" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreen;
