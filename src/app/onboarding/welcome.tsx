import { Image, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { art } from '@/constants/art';

export default function WelcomeScreen() {
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
    </Screen>
  );
}
