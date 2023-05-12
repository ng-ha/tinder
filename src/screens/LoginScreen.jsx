import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import useAuth from '../hooks/useAuth';

const LoginScreen = () => {
  const { request, promptAsync } = useAuth();

  return (
    <View className="flex-1">
      <ImageBackground
        source={require('../../assets/images/tinder.png')}
        resizeMode="cover"
        className="flex-1"
      >
        <TouchableOpacity
          onPress={() => promptAsync()}
          className="absolute bottom-40 w-52 bg-white p-4 rounded-2xl mx-[25%]"
          disabled={!request}
        >
          <Text className="text-center font-bold">Sign in & get swiping</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
