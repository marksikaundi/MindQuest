import { useCallback, useState } from 'react';
import { Image, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { art } from '@/constants/art';
import { addItem, grantReward, isRegionUnlocked, track, visitRegion } from '@/game/actions';
import { ownsItem } from '@/game/actions';
import { useQuestStore } from '@/stores/questStore';

export default function CreativeCityScreen() {
  const questsDone = useQuestStore((state) => state.claimedIds.length);
  const [saved, setSaved] = useState(() => ownsItem('banner'));
  useFocusEffect(useCallback(() => visitRegion('creative-city'), []));

  if (!isRegionUnlocked('creative-city') && questsDone < 3) {
    return (
      <Screen>
        <AppText size={28} weight="800">Creative City</AppText>
        <AppText>Complete 3 quests to unlock.</AppText>
        <Button label="Back to map" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen tabBar>
      <Image source={art.city} style={{ width: '100%', height: 220, borderRadius: 28 }} resizeMode="cover" />
      <AppText size={28} weight="800">Creative City</AppText>
      <AppText>Pick a banner color. The plaza keeps the one you choose.</AppText>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {['#E85D75', '#45C4B0', '#FFC857', '#6C63FF'].map((color) => (
          <View key={color} style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: color }} />
        ))}
      </View>
      <Button
        label={saved ? 'Banner saved' : 'Hang my banner'}
        disabled={saved}
        onPress={() => {
          if (saved || ownsItem('banner')) return;
          addItem('banner', 1);
          grantReward({ coins: 40, xp: 40, stars: 1 }, 'city');
          track('complete_puzzle', 1);
          setSaved(true);
        }}
      />
    </Screen>
  );
}
