import { FlatList, View } from 'react-native';

import { GameHeader } from '@/components/game/GameHeader';
import { QuestCard } from '@/components/quests/QuestCard';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { useDailyView, useQuestBoard } from '@/hooks/use-game-data';
import { useGameTheme } from '@/hooks/use-game-theme';

export default function QuestsScreen() {
  const quests = useQuestBoard();
  const daily = useDailyView();
  const { colors } = useGameTheme();
  const active = quests.filter((quest) => !quest.completed);
  const done = quests.filter((quest) => quest.completed);

  return (
    <Screen tabBar scroll={false} header={<GameHeader />} padded={false}>
      <FlatList
        data={[...active, ...done]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 4 }}>
            <AppText size={28} weight="800">Quests</AppText>
            <Card>
              <AppText weight="800">Daily · {daily.title}</AppText>
              <AppText color={colors.muted}>{daily.description}</AppText>
              <AppText weight="700" style={{ marginTop: 6 }}>
                {daily.progress}/{daily.target} {daily.claimed ? '· Reward claimed' : ''}
              </AppText>
              <View style={{ marginTop: 8 }}>
                <ProgressBar value={daily.target === 0 ? 0 : daily.progress / daily.target} color={colors.secondary} />
              </View>
              <AppText size={13} color={colors.muted} style={{ marginTop: 6 }}>
                Reward {daily.rewards.coins} coins, {daily.rewards.xp} XP, {daily.rewards.stars} star. A new challenge arrives with the date.
              </AppText>
            </Card>
            <AppText weight="800">{active.length} active · {done.length} complete</AppText>
          </View>
        }
        renderItem={({ item }) => <QuestCard quest={item} />}
        ListEmptyComponent={<AppText>No quests yet.</AppText>}
      />
    </Screen>
  );
}
