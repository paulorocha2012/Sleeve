import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/navigation/RootNavigator';
import { AuthProvider } from '@/state/AuthContext';
import { ReviewsProvider } from '@/state/ReviewsContext';
import { DiaryProvider } from '@/state/DiaryContext';
import { FeedbackProvider } from '@/feedback/FeedbackContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ReviewsProvider>
          <DiaryProvider>
            <FeedbackProvider>
              <StatusBar style="dark" />
              <RootNavigator />
            </FeedbackProvider>
          </DiaryProvider>
        </ReviewsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
