import { View } from 'react-native';

import { CoinCounter } from '@/components/game/CoinCounter';
import { XPBar } from '@/components/game/XPBar';
import { AppText } from '@/components/ui/AppText';
import { KenneyIcon } from '@/components/ui/KenneyIcon';
import { radius } from '@/constants/tokens';
import { useGameTheme } from '@/hooks/use-game-theme';
import { usePlayerStore } from '@/stores/playerStore';

export function GameHeader() {
  const player = usePlayerStore((state) => state.player);
  const { colors } = useGameTheme();

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 8, gap: 8 }}>
      <XPBar totalXp={player.xp} level={player.level} />
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
