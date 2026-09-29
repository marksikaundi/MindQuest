import { useCallback, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { GameHeader } from '@/components/game/GameHeader';
import { GreatTree } from '@/components/world/GreatTree';
import { Avatar } from '@/components/player/Avatar';
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

const actions = [
  { id: 'village', label: 'Village', icon: 'walk' },
  { id: 'quests', label: 'Quests', icon: 'flag' },
  { id: 'portal', label: 'Map', icon: 'map' },
  { id: 'home', label: 'Home', icon: 'bed' },
  { id: 'shop', label: 'Shop', icon: 'bag' },
] as const;

export default function QuestlandScreen() {
  const { colors } = useGameTheme();
  const level = usePlayerStore((state) => state.player.level);
  const character = usePlayerStore((state) => state.character);
  const daily = useDailyView();
  const [shopOpen, setShopOpen] = useState(false);
  const [shopNote, setShopNote] = useState('');

  useFocusEffect(
    useCallback(() => {
      visitRegion('questland');
    }, []),
  );

  const choose = (id: (typeof actions)[number]['id'] | 'tree') => {
    if (id === 'village') {
      exploreVillage();
      return;
    }
    if (id === 'tree') {
      visitTree();
      return;
    }
    if (id === 'quests') router.push('/quests');
    if (id === 'portal') router.push('/world');
    if (id === 'home') router.push('/home');
    if (id === 'shop') setShopOpen((open) => !open);
  };

  return (
    <Screen tabBar scroll={false} padded={false} header={<GameHeader />}>
      <View style={{ flex: 1, marginHorizontal: 12, marginBottom: 8, borderRadius: 28, overflow: 'hidden', backgroundColor: colors.sky }}>
        <Image source={art.questland} style={{ width: '100%', height: '100%' }} resizeMode="cover" accessibilityIgnoresInvertColors />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Daily challenge"
          onPress={() => router.push('/quests')}
          style={{ position: 'absolute', top: 12, right: 12, minHeight: 44, paddingHorizontal: 14, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' }}>
          <AppText weight="800" size={14}>
            {daily.claimed ? 'Daily done' : `${daily.progress}/${daily.target}`}
          </AppText>
        </Pressable>
        <View style={{ position: 'absolute', right: 8, top: 64 }}>
          <GreatTree level={level} onPress={() => choose('tree')} />
        </View>
        <View style={{ position: 'absolute', left: 12, bottom: 108 }}>
          <Avatar character={character} size={84} />
        </View>
        <View style={{ position: 'absolute', left: 8, right: 8, bottom: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
          {actions.map((action) => (
            <Pressable
              key={action.id}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              onPress={() => choose(action.id)}
              style={{ width: 62, alignItems: 'center', gap: 4 }}>
              <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: action.id === 'shop' && shopOpen ? colors.primary : 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={action.icon} size={26} color={action.id === 'shop' && shopOpen ? '#FFFFFF' : colors.primaryDark} />
              </View>
              <AppText size={11} weight="800">
                {action.label}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>
      {shopOpen ? (
        <Card style={{ marginHorizontal: 12, marginBottom: 8, maxHeight: 220 }}>
          {shopNote ? <AppText weight="800">{shopNote}</AppText> : null}
          {ITEMS.filter((item) => item.shop && item.price > 0).slice(0, 4).map((item) => (
            <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <AppText weight="800" style={{ flex: 1 }}>
                {item.name}
              </AppText>
              <Button label={`${item.price}`} onPress={() => setShopNote(purchaseItem(item.id))} style={{ minWidth: 88 }} />
            </View>
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}
