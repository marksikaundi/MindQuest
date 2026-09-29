import { useCallback, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { GameHeader } from '@/components/game/GameHeader';
import { GreatTree } from '@/components/world/GreatTree';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { art } from '@/constants/art';
import { ITEMS } from '@/data/items';
import { exploreVillage, purchaseItem, visitRegion, visitTree } from '@/game/actions';
import { useDailyView } from '@/hooks/use-game-data';
import { useGameTheme } from '@/hooks/use-game-theme';
import { usePlayerStore } from '@/stores/playerStore';
import { Avatar } from '@/components/player/Avatar';

const spots = [
  { id: 'village', label: 'Village', detail: 'Walk the square' },
  { id: 'tree', label: 'Great Tree', detail: 'See your progress' },
  { id: 'quests', label: 'Quest Board', detail: 'Read your tasks' },
  { id: 'portal', label: 'Portal Plaza', detail: 'Open the map' },
  { id: 'home', label: 'Your Home', detail: 'Decorate a room' },
  { id: 'shop', label: 'Shop', detail: 'Spend coins' },
] as const;

export default function QuestlandScreen() {
  const { colors } = useGameTheme();
  const level = usePlayerStore((state) => state.player.level);
  const character = usePlayerStore((state) => state.character);
  const daily = useDailyView();
  const [note, setNote] = useState('Tap a place in Questland to explore.');
  const [shopOpen, setShopOpen] = useState(false);
  const [shopNote, setShopNote] = useState('');

  useFocusEffect(
    useCallback(() => {
      visitRegion('questland');
    }, []),
  );

  const choose = (id: (typeof spots)[number]['id']) => {
    if (id === 'village') {
      exploreVillage();
      setNote('The fountain sparkles. A neighbor waves from the path.');
      return;
    }
    if (id === 'tree') {
      visitTree();
      setNote('The Great Tree grows when you do. Reach level 2 and 3 to see it change.');
      return;
    }
    if (id === 'quests') router.push('/quests');
    if (id === 'portal') router.push('/world');
    if (id === 'home') router.push('/home');
    if (id === 'shop') setShopOpen(true);
  };

  return (
    <Screen tabBar header={<GameHeader />}>
      <AppText size={28} weight="800">
        Questland
      </AppText>
      <View style={{ borderRadius: 28, overflow: 'hidden', minHeight: 360, backgroundColor: colors.sky }}>
        <Image source={art.questland} style={{ width: '100%', height: 360 }} resizeMode="cover" accessibilityIgnoresInvertColors />
        <View style={{ position: 'absolute', right: 8, bottom: 8 }}>
          <GreatTree level={level} onPress={() => choose('tree')} />
        </View>
        <View style={{ position: 'absolute', left: 16, bottom: 12 }}>
          <Avatar character={character} size={72} />
        </View>
      </View>
      <AppText color={colors.muted}>{note}</AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {spots.map((spot) => (
          <Pressable
            key={spot.id}
            accessibilityRole="button"
            accessibilityLabel={spot.label}
            onPress={() => choose(spot.id)}
            style={{ width: '48%', minHeight: 76, backgroundColor: colors.surface, borderRadius: 18, padding: 12, justifyContent: 'center' }}>
            <AppText weight="800">{spot.label}</AppText>
            <AppText size={13} color={colors.muted}>
              {spot.detail}
            </AppText>
          </Pressable>
        ))}
      </View>
      <Card>
        <AppText weight="800">Daily challenge</AppText>
        <AppText style={{ marginTop: 4 }}>{daily.title}</AppText>
        <AppText color={colors.muted}>{daily.description}</AppText>
        <AppText weight="700" style={{ marginTop: 6 }}>
          {daily.progress}/{daily.target} {daily.claimed ? '· Claimed' : ''}
        </AppText>
        <Button label="Open quests" variant="secondary" onPress={() => router.push('/quests')} style={{ marginTop: 10 }} />
      </Card>
      {shopOpen ? (
        <Card>
          <AppText size={20} weight="800">
            Village shop
          </AppText>
          <AppText color={colors.muted}>Clothes, accessories, and home things. No real-money purchases.</AppText>
          {shopNote ? <AppText weight="700">{shopNote}</AppText> : null}
          {ITEMS.filter((item) => item.shop && item.price > 0).map((item) => (
            <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <View style={{ flex: 1 }}>
                <AppText weight="800">{item.name}</AppText>
                <AppText size={13} color={colors.muted}>
                  {item.price} coins
                </AppText>
              </View>
              <Button label="Buy" onPress={() => setShopNote(purchaseItem(item.id))} style={{ minWidth: 88 }} />
            </View>
          ))}
          <Button label="Close shop" variant="ghost" onPress={() => setShopOpen(false)} style={{ marginTop: 12 }} />
        </Card>
      ) : null}
    </Screen>
  );
}
