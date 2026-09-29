import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useGameTheme } from '@/hooks/use-game-theme';
import { useReducedMotion } from '@/hooks/use-game-theme';

export function ProgressBar({ value, color }: { value: number; color?: string }) {
  const { colors } = useGameTheme();
  const reduced = useReducedMotion();
  const progress = useSharedValue(0);
  const clamped = Math.max(0, Math.min(1, value));

  useEffect(() => {
    progress.value = withTiming(clamped, { duration: reduced ? 1 : 420 });
  }, [clamped, progress, reduced]);

  const fill = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={{ height: 12, borderRadius: 999, backgroundColor: colors.line, overflow: 'hidden' }}>
      <Animated.View style={[{ height: '100%', backgroundColor: color ?? colors.primary, borderRadius: 999 }, fill]} />
    </View>
  );
}
