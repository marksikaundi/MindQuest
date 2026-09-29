import { useState } from 'react';
import { Image, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { art } from '@/constants/art';
import { useGameTheme } from '@/hooks/use-game-theme';
import { usePlayerStore } from '@/stores/playerStore';
import { loadGameState } from '@/utils/storage';

export default function WelcomeScreen() {
  const { colors } = useGameTheme();
  const onboarded = usePlayerStore((state) => state.onboarded);
  const [message, setMessage] = useState('');

  return (
    <Screen scroll>
      <View style={{ alignItems: 'center', gap: 8, marginTop: 12 }}>
        <Image source={art.logo} style={{ width: 120, height: 120, borderRadius: 32 }} accessibilityIgnoresInvertColors />
        <AppText size={32} weight="800" center>
          MindQuest
        </AppText>
      </View>
      <Image source={art.questland} style={{ width: '100%', height: 280, borderRadius: 28 }} resizeMode="cover" accessibilityIgnoresInvertColors />
      <Button label="Start Adventure" onPress={() => router.push('/onboarding/character')} />
      <Button
        label="I Already Have a Game"
        variant="secondary"
        onPress={() => {
          void loadGameState().then(() => {
            if (usePlayerStore.getState().onboarded) {
              router.replace('/game');
              return;
            }
            setMessage(onboarded ? '' : 'No saved adventure was found on this device.');
          });
        }}
      />
      {message ? (
        <AppText center color={colors.danger}>
          {message}
        </AppText>
      ) : null}
    </Screen>
  );
}
