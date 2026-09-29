import { useCallback } from 'react';
import { FlatList, Image, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { GameHeader } from '@/components/game/GameHeader';
import { RegionCard } from '@/components/world/RegionCard';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { art } from '@/constants/art';
import { openWorldMap } from '@/game/actions';
import { useRegionViews } from '@/hooks/use-game-data';

export default function WorldMapScreen() {
  const regions = useRegionViews();

  useFocusEffect(
    useCallback(() => {
      openWorldMap();
    }, []),
  );

  return (
    <Screen tabBar scroll={false} header={<GameHeader />} padded={false}>
      <FlatList
        data={regions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 120 }}
        ListHeaderComponent={
          <View style={{ gap: 10, marginBottom: 6 }}>
            <AppText size={28} weight="800">
              World map
            </AppText>
            <Image source={art.map} style={{ width: '100%', height: 180, borderRadius: 28 }} resizeMode="cover" accessibilityIgnoresInvertColors />
          </View>
        }
        renderItem={({ item }) => <RegionCard {...item} />}
      />
    </Screen>
  );
}
