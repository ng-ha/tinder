import { Button, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const Homescreen = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Homescreen</Text>
      <Button title="Go to Chat screen" onPress={() => navigation.navigate('Chat')} />
    </View>
  );
};

export default Homescreen;
