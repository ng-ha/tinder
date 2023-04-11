import React from 'react';
import StackNavigator from './src/navigation/StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/hooks/useAuth';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
