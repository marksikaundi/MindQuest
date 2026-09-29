import { memo } from 'react';
import { Image, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppText } from '@/components/ui/AppText';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { art } from '@/constants/art';
import { unlockCopy } from '@/data/regions';
import { useGameTheme } from '@/hooks/use-game-theme';
import type { RegionDefinition } from '@/types/game';

type Props = RegionDefinition & {
  unlocked: boolean;
  progressLabel: string;
  progressValue: number;
};

export const RegionCard = memo(function RegionCard({ unlocked, progressLabel, progressValue, ...region }: Props) {
  const { colors } = useGameTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={unlocked ? `Travel to ${region.name}` : unlockCopy(region)}
      disabled={!unlocked}
      onPress={() => router.push(region.route as '/game')}
      style={{ borderRadius: 24, overflow: 'hidden', minHeight: 168, backgroundColor: colors.surface }}>
      <Image source={art[region.art]} style={{ width: '100%', height: 168 }} resizeMode="cover" accessibilityIgnoresInvertColors />
      <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12, gap: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AppText weight="800" size={20} color="#FFFFFF" style={{ flex: 1, textShadowColor: 'rgba(0,0,0,0.45)', textShadowRadius: 6 }}>
            {region.name}
          </AppText>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: unlocked ? colors.primary : 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name={unlocked ? 'arrow-forward' : 'lock-closed'} size={22} color={unlocked ? '#FFFFFF' : colors.ink} />
          </View>
        </View>
        <ProgressBar value={unlocked ? progressValue : 0} />
        {unlocked ? null : (
          <AppText size={13} weight="800" color="#FFFFFF">
            {unlockCopy(region)}
          </AppText>
        )}
        {unlocked && progressLabel ? (
          <AppText size={12} weight="700" color="#FFFFFF">
            {progressLabel}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
});
