import { FlatList } from 'react-native';

import { GameHeader } from '@/components/game/GameHeader';
import { MiniGameCard } from '@/components/minigames/MiniGameCard';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { MINIGAMES } from '@/data/minigames';
import { useGameStore } from '@/stores/gameStore';

export default function MiniGamesScreen() {
  const memory = useGameStore((state) => state.minigames.memory);
  const match = useGameStore((state) => state.minigames.match);
  const numberGame = useGameStore((state) => state.minigames.number);

  return (
    <Screen tabBar scroll={false} header={<GameHeader />} padded={false}>
      <FlatList
        data={MINIGAMES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}
        ListHeaderComponent={
          <>
            <AppText size={28} weight="800">Mini-games</AppText>
            <AppText>
              Memory best {memory.bestScore} · Match best {match.bestScore} · Number best {numberGame.bestScore}
            </AppText>
          </>
        }
        renderItem={({ item }) => <MiniGameCard game={item} />}
      />
    </Screen>
  );
}
