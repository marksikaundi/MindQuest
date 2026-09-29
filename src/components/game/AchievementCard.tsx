import { memo } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useGameTheme } from '@/hooks/use-game-theme';

const icons = {
  walk: 'walk',
  puzzle: 'extension-puzzle',
  cards: 'albums',
  gem: 'diamond',
  map: 'map',
} as const;

export const AchievementCard = memo(function AchievementCard({
  title,
  icon,
  current,
  target,
  unlocked,
}: {
  title: string;
  description: string;
  icon: keyof typeof icons;
  current: number;
  target: number;
  unlocked: boolean;
}) {
  const { colors } = useGameTheme();
  return (
    <Card>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: unlocked ? colors.accent : colors.sky, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icons[icon]} size={22} color={colors.ink} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
            <AppText weight="800" style={{ flex: 1 }}>
              {title}
            </AppText>
            <Badge label={unlocked ? 'Unlocked' : 'Locked'} color={unlocked ? colors.secondary : colors.line} textColor={unlocked ? '#FFFFFF' : colors.text} />
          </View>
          <AppText size={12} weight="700">
            {current}/{target}
          </AppText>
          <ProgressBar value={target === 0 ? 0 : current / target} color={unlocked ? colors.success : colors.primary} />
        </View>
      </View>
    </Card>
  );
});
