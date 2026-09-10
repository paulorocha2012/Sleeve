import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/navigation/RootNavigator';
import { ReviewsProvider } from '@/state/ReviewsContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ReviewsProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </ReviewsProvider>
    </SafeAreaProvider>
  );
}
