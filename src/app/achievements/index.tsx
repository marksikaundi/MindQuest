import { FlatList } from 'react-native';

import { AchievementCard } from '@/components/game/AchievementCard';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { useAchievementViews } from '@/hooks/use-game-data';
import { usePlayerStore } from '@/stores/playerStore';

export default function AchievementsScreen() {
  const achievements = useAchievementViews();
  const stars = usePlayerStore((state) => state.player.stars);

  return (
    <Screen scroll={false} padded={false}>
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
        ListHeaderComponent={
          <>
            <AppText size={28} weight="800">Achievements</AppText>
            <AppText weight="800">{stars} stars collected</AppText>
          </>
        }
        renderItem={({ item }) => (
          <AchievementCard
            title={item.title}
            description={item.description}
            icon={item.icon}
            current={item.current}
            target={item.target}
            unlocked={item.unlocked}
          />
        )}
      />
    </Screen>
  );
}
