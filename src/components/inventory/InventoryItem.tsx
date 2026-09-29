import { memo } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { useGameTheme } from '@/hooks/use-game-theme';
import type { ItemDefinition } from '@/types/game';

const icons = {
  shirt: 'shirt',
  sparkles: 'sparkles',
  home: 'home',
  leaf: 'leaf',
  star: 'star',
  key: 'key',
  gem: 'diamond',
  medal: 'ribbon',
} as const;

export const InventoryItem = memo(function InventoryItem({
  item,
  quantity,
  owned,
}: {
  item: ItemDefinition;
  quantity: number;
  owned: boolean;
}) {
  const { colors } = useGameTheme();
  return (
    <Card style={{ opacity: owned ? 1 : 0.55, padding: 12 }}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: colors.sky, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icons[item.icon]} size={22} color={colors.primaryDark} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="800">{item.name}</AppText>
          <AppText size={13} color={colors.muted}>
            {owned ? `Owned × ${quantity}` : 'Locked'}
          </AppText>
        </View>
        <AppText weight="800" size={13}>
          {owned ? 'Open' : item.price > 0 ? `${item.price} coins` : 'Locked'}
        </AppText>
      </View>
    </Card>
  );
});
