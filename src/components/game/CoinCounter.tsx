import { View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useGameTheme } from '@/hooks/use-game-theme';

export function CoinCounter({ coins }: { coins: number }) {
  const { colors } = useGameTheme();
  return (
    <View accessibilityLabel={`${coins} coins`} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 }}>
      <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: colors.coin }} />
      <AppText weight="800" size={14} color={colors.coin}>
        {coins}
      </AppText>
    </View>
  );
}
