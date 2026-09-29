import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { AppText } from '@/components/ui/AppText';
import type { MiniGameDefinition } from '@/data/minigames';

const icons = {
  'memory-flip': 'albums',
  'match-master': 'shapes',
  'number-quest': 'calculator',
} as const;

export const MiniGameCard = memo(function MiniGameCard({ game }: { game: MiniGameDefinition }) {
  const icon = icons[game.id as keyof typeof icons] ?? 'play';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Play ${game.title}`}
      onPress={() => router.push(game.route)}
      style={{ minHeight: 112, borderRadius: 24, backgroundColor: game.accent, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={32} color="#FFFFFF" />
      </View>
      <AppText weight="800" size={24} color="#FFFFFF" style={{ flex: 1 }}>
        {game.title}
      </AppText>
      <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="play" size={26} color={game.accent} />
      </View>
    </Pressable>
  );
});
