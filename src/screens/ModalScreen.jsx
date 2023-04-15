import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [occupation, setOccupation] = useState(null);
  const [age, setAge] = useState(null);
  const [name, setName] = useState('');
  const incomplete = !image || !occupation || !age || !name;
  const updateUserProfile = async () => {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        displayName: name,
        photoURL: image,
        occupation,
        age,
        timestamp: serverTimestamp(),
      });
      Alert.alert('Information', 'Your profile has been updated successfully!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error!', error.message);
    }
  };
  return (
    <View className="flex-1 items-center pt-1">
      <Image
        source={require('../../assets/images/Tinder-logo.png')}
        resizeMode="contain"
        className="h-20 w-full"
      />
      <Text className="text-xl text-gray-500 p-2 font-bold">Welcome {user.displayName}</Text>
      <Text className="text-center p-4 font-bold text-red-400">Step 1: The Display Name</Text>
      <TextInput
        value={name}
        onChangeText={(text) => setName(text)}
        placeholder="Enter your display name"
        className="text-center text-xl pb-2"
      />
      <Text className="text-center p-4 font-bold text-red-400">Step 2: The Profile Pic</Text>
      <TextInput
        value={image}
        onChangeText={(text) => setImage(text)}
        placeholder="Enter a Profile Pic Url"
        className="text-center text-xl pb-2"
      />
      <Text className="text-center p-4 font-bold text-red-400">Step 3: The Occupation</Text>
      <TextInput
        value={occupation}
        onChangeText={(text) => setOccupation(text)}
        placeholder="Enter your occupation"
        className="text-center text-xl pb-2"
      />
      <Text className="text-center p-4 font-bold text-red-400">Step 4: The Age</Text>
      <TextInput
        value={age}
        onChangeText={(text) => setAge(text)}
        placeholder="Enter your age"
        className="text-center text-xl pb-2"
        keyboardType="numeric"
      />
      <TouchableOpacity
        disabled={incomplete}
        onPress={updateUserProfile}
        className={`w-64 p-3 rounded-xl absolute bottom-10 ${
          incomplete ? 'bg-gray-400' : 'bg-red-400'
        }`}
      >
        <Text className="text-center text-white text-xl">Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModalScreen;
