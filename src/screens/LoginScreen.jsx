import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const { request, response, promptAsync, loading } = useAuth();
  const navigation = useNavigation();

  // useLayoutEffect(() => {
  //   navigation.setOptions({ headerShown: false });
  // }, []);

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
