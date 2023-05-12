import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { AuthProvider } from './src/hooks/useAuth';
import StackNavigator from './src/navigation/StackNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
