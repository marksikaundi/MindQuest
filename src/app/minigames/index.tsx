import { FlatList } from 'react-native';

import { GameHeader } from '@/components/game/GameHeader';
import { MiniGameCard } from '@/components/minigames/MiniGameCard';
import { Screen } from '@/components/ui/Screen';
import { MINIGAMES } from '@/data/minigames';

export default function MiniGamesScreen() {
  return (
    <Screen tabBar scroll={false} header={<GameHeader />} padded={false}>
      <FlatList
        data={MINIGAMES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 120 }}
        renderItem={({ item }) => <MiniGameCard game={item} />}
      />
    </Screen>
  );
}
