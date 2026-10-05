import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ShopProvider } from './src/context/ShopContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ShopProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor="#0f172a" />
          <AppNavigator />
        </NavigationContainer>
      </ShopProvider>
    </SafeAreaProvider>
  );
}
