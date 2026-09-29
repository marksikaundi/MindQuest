import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { art } from '@/constants/art';
import { useReducedMotion } from '@/hooks/use-game-theme';
import { useGameStore } from '@/stores/gameStore';
import { usePlayerStore } from '@/stores/playerStore';

export default function SplashScreen() {
  const hydrated = useGameStore((state) => state.hydrated);
  const onboarded = usePlayerStore((state) => state.onboarded);
  const reduced = useReducedMotion();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!hydrated || leaving) return;
    const timer = setTimeout(() => {
      setLeaving(true);
      router.replace(onboarded ? '/game' : '/onboarding/welcome');
    }, reduced ? 250 : 1500);
    return () => clearTimeout(timer);
  }, [hydrated, leaving, onboarded, reduced]);

  return (
    <View style={{ flex: 1, backgroundColor: '#4E46C8', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Animated.View entering={reduced ? undefined : FadeInDown.duration(700)} style={{ alignItems: 'center', gap: 12 }}>
        <Image source={art.logo} style={{ width: 148, height: 148, borderRadius: 36 }} accessibilityIgnoresInvertColors />
        <AppText size={40} weight="800" color="#FFFFFF" center>
          MindQuest
        </AppText>
        <AppText size={18} weight="700" color="#F4E7B2" center>
          Play. Explore. Learn. Grow.
        </AppText>
      </Animated.View>
    </View>
  );
}
