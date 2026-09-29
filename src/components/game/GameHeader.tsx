import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { Avatar } from '@/components/player/Avatar';
import { CoinCounter } from '@/components/game/CoinCounter';
import { XPBar } from '@/components/game/XPBar';
import { AppText } from '@/components/ui/AppText';
import { KenneyIcon } from '@/components/ui/KenneyIcon';
import { radius } from '@/constants/tokens';
import { useGameTheme } from '@/hooks/use-game-theme';
import { usePlayerStore } from '@/stores/playerStore';

export function GameHeader() {
  const player = usePlayerStore((state) => state.player);
  const character = usePlayerStore((state) => state.character);
  const { colors } = useGameTheme();

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 8, gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => router.push('/character')}
          style={{ width: 52, height: 52, borderRadius: 26, overflow: 'hidden', backgroundColor: colors.sky, alignItems: 'center' }}>
          <View style={{ marginTop: -8 }}>
            <Avatar character={character} size={52} />
          </View>
        </Pressable>
        <View style={{ flex: 1 }}>
          <AppText weight="800" size={18} numberOfLines={1}>
            {player.name || 'Explorer'}
          </AppText>
          <XPBar totalXp={player.xp} level={player.level} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: 12, minHeight: 40 }}>
          <CoinCounter coins={player.coins} />
        </View>
        <View accessibilityLabel={`${player.stars} stars`} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: 12, minHeight: 40 }}>
          <KenneyIcon name="trophy" size={16} color={colors.star} />
          <AppText weight="800" size={14}>
            {player.stars}
          </AppText>
        </View>
      </View>
    </View>
  );
}
