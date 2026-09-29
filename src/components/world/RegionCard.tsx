import { memo } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { art } from '@/constants/art';
import { useGameTheme } from '@/hooks/use-game-theme';
import { unlockCopy } from '@/data/regions';
import type { RegionDefinition } from '@/types/game';
import { Image } from 'react-native';

type Props = RegionDefinition & {
  unlocked: boolean;
  progressLabel: string;
  progressValue: number;
};

export const RegionCard = memo(function RegionCard({ unlocked, progressLabel, progressValue, ...region }: Props) {
  const { colors } = useGameTheme();
  return (
    <Card style={{ padding: 12 }}>
      <Image source={art[region.art]} style={{ width: '100%', height: 120, borderRadius: 16 }} resizeMode="cover" accessibilityIgnoresInvertColors />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 8 }}>
        <AppText weight="800" size={18} style={{ flex: 1 }}>
          {region.name}
        </AppText>
        <Badge label={unlocked ? 'Open' : 'Locked'} color={unlocked ? colors.secondary : colors.line} />
      </View>
      <AppText color={colors.muted} style={{ marginTop: 4 }}>
        {region.description}
      </AppText>
      <AppText size={13} weight="700" style={{ marginTop: 8 }}>
        {unlocked ? progressLabel : unlockCopy(region)}
      </AppText>
      <View style={{ marginTop: 8 }}>
        <ProgressBar value={unlocked ? progressValue : 0} />
      </View>
      <Button
        label={unlocked ? 'Travel' : 'Locked'}
        variant={unlocked ? 'primary' : 'ghost'}
        disabled={!unlocked}
        onPress={() => router.push(region.route as '/game')}
        style={{ marginTop: 12 }}
      />
    </Card>
  );
});
