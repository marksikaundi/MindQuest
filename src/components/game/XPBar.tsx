import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useGameTheme } from '@/hooks/use-game-theme';
import { XP_PER_LEVEL, progressFromTotalXp } from '@/utils/progression';

export function XPBar({ totalXp, level }: { totalXp: number; level: number }) {
  const { colors } = useGameTheme();
  const progress = progressFromTotalXp(totalXp);
  return (
    <View style={{ gap: 4, flex: 1 }}>
      <AppText size={12} weight="800" color={colors.muted}>
        Level {level} · {progress.xpIntoLevel} / {XP_PER_LEVEL} XP
      </AppText>
      <ProgressBar value={progress.xpIntoLevel / XP_PER_LEVEL} />
    </View>
  );
}
