import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';

const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const [lastMessage, setLastMessage] = useState('');

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
  }, [matchDetails, user]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'matches', matchDetails.id, 'messages'), orderBy('timestamp', 'desc')),
        (snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message)
      ),
    [matchDetails, db]
  );
  return (
    <TouchableOpacity
      className="flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg shadow-lg"
      onPress={() =>
        navigation.navigate('Message', {
          matchDetails,
        })
      }
    >
      <Image source={{ uri: matchedUserInfo?.photoURL }} className="rounded-full h-16 w-16 mr-4" />
      <View>
        <Text className="text-lg font-semibold mb-1">{matchedUserInfo?.displayName}</Text>
        <Text>{lastMessage || 'Say hi!'}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;
