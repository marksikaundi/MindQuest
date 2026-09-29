import { memo } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useGameTheme } from '@/hooks/use-game-theme';
import type { Quest } from '@/types/game';

export const QuestCard = memo(function QuestCard({ quest }: { quest: Quest }) {
  const { colors } = useGameTheme();
  const done = quest.objectives.filter((objective) => objective.current >= objective.target).length;
  return (
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
        <AppText weight="800" size={18} style={{ flex: 1 }}>
          {quest.title}
        </AppText>
        <Badge label={quest.completed ? 'Done' : 'Active'} color={quest.completed ? colors.secondary : colors.accent} />
      </View>
      <View style={{ marginTop: 12, gap: 8 }}>
        {quest.objectives.map((objective) => {
          const complete = objective.current >= objective.target;
          return (
            <View key={objective.id} style={{ gap: 4 }}>
              <AppText size={14} weight="700">
                {complete ? '✓' : '○'} {objective.description} ({objective.current}/{objective.target})
              </AppText>
              <ProgressBar value={objective.current / objective.target} color={complete ? colors.success : colors.primary} />
            </View>
          );
        })}
      </View>
      <AppText size={13} weight="800" style={{ marginTop: 10 }}>
        {quest.rewards.coins} coins · {quest.rewards.xp} XP
      </AppText>
    </Card>
  );
});
