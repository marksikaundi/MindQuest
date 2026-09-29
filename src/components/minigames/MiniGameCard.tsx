import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import type { MiniGameDefinition } from '@/data/minigames';
import { useGameTheme } from '@/hooks/use-game-theme';

export const MiniGameCard = memo(function MiniGameCard({ game }: { game: MiniGameDefinition }) {
  const { colors } = useGameTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Play ${game.title}`} onPress={() => router.push(game.route)}>
      <Card style={{ borderLeftWidth: 6, borderLeftColor: game.accent }}>
        <AppText weight="800" size={20}>
          {game.title}
        </AppText>
        <AppText color={colors.muted} style={{ marginTop: 4 }}>
          {game.blurb}
        </AppText>
        <View style={{ marginTop: 10, alignSelf: 'flex-start', backgroundColor: game.accent, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}>
          <AppText weight="800" size={14} color="#FFFFFF">
            Play
          </AppText>
        </View>
      </Card>
    </Pressable>
  );
});
