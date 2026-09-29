import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CelebrationHost } from '@/components/game/CelebrationHost';
import { ErrorBoundary } from '@/components/game/ErrorBoundary';
import { MusicPlayer } from '@/components/game/MusicPlayer';
import { useReducedMotion } from '@/hooks/use-game-theme';
import { loadGameState } from '@/utils/storage';

export default function RootLayout() {
  const reduced = useReducedMotion();

  useEffect(() => {
    void loadGameState();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <StatusBar style="dark" />
        <MusicPlayer />
        <Stack screenOptions={{ headerShown: false, animation: reduced ? 'none' : 'fade' }} />
        <CelebrationHost />
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
