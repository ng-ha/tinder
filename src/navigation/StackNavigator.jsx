import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Homescreen from '../screens/Homescreen';
import Chatscreen from '../screens/Chatscreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  const user = true;
  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Home" component={Homescreen} />
          <Stack.Screen name="Chat" component={Chatscreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
