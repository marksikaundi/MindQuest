import { useMemo, useState } from 'react';
import { FlatList } from 'react-native';

import { InventoryItem } from '@/components/inventory/InventoryItem';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ITEMS } from '@/data/items';
import { useInventoryStore } from '@/stores/inventoryStore';
import type { ItemCategory } from '@/types/game';

const categories: { id: ItemCategory; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'collectible', label: 'Finds' },
  { id: 'special', label: 'Special' },
];

export default function InventoryScreen() {
  const quantities = useInventoryStore((state) => state.quantities);
  const [category, setCategory] = useState<ItemCategory>('home');
  const items = useMemo(
    () => ITEMS.filter((item) => item.category === category && item.id !== 'none'),
    [category],
  );

  return (
    <Screen scroll={false} padded={false}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 32 }}
        ListHeaderComponent={
          <>
            <AppText size={28} weight="800">Inventory</AppText>
            <SegmentedControl options={categories} value={category} onChange={(id) => setCategory(id as ItemCategory)} />
          </>
        }
        renderItem={({ item }) => (
          <InventoryItem item={item} quantity={quantities[item.id] ?? 0} owned={(quantities[item.id] ?? 0) > 0} />
        )}
        ListEmptyComponent={<AppText>Nothing in this pack yet.</AppText>}
      />
    </Screen>
  );
}
