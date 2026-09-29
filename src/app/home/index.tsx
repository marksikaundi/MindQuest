import { useState } from 'react';
import { ImageBackground, Pressable, View } from 'react-native';

import { Avatar } from '@/components/player/Avatar';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { art } from '@/constants/art';
import { HOME_SLOTS, getItem } from '@/data/items';
import { ownsItem, placeDecoration, setWallpaper } from '@/game/actions';
import { useGameTheme } from '@/hooks/use-game-theme';
import { useGameStore } from '@/stores/gameStore';
import { usePlayerStore } from '@/stores/playerStore';

const decor = ['plant', 'lamp', 'rug-cozy', 'bookshelf', 'star-banner', 'trophy-shelf'];

export default function HomeScreen() {
  const character = usePlayerStore((state) => state.character);
  const home = useGameStore((state) => state.home);
  const { colors } = useGameTheme();
  const [slot, setSlot] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const background = home.wallpaper === 'timber' ? art.wood : art.home;
  const night = home.wallpaper === 'night';

  return (
    <Screen>
      <AppText size={28} weight="800">Your home</AppText>
      <ImageBackground source={background} style={{ height: 320, borderRadius: 28, overflow: 'hidden', justifyContent: 'flex-end' }} imageStyle={{ borderRadius: 28 }}>
        <View style={{ ...StyleSheetFill, backgroundColor: night ? 'rgba(20,24,68,0.45)' : 'transparent' }} />
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <Avatar character={character} size={120} />
        </View>
      </ImageBackground>
      {message ? <AppText weight="800">{message}</AppText> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {HOME_SLOTS.map((item) => {
          const placed = home.slots[item.id];
          return (
            <Pressable key={item.id} accessibilityRole="button" onPress={() => setSlot(item.id)} style={{ width: '48%', minHeight: 72, borderRadius: 16, padding: 12, backgroundColor: slot === item.id ? colors.primary : colors.surface }}>
              <AppText weight="800" color={slot === item.id ? '#FFFFFF' : colors.text}>{item.label}</AppText>
              <AppText size={13} color={slot === item.id ? '#FFFFFF' : colors.muted}>{placed ? getItem(placed)?.name : 'Empty'}</AppText>
            </Pressable>
          );
        })}
      </View>
      {slot ? (
        <Card>
          <AppText weight="800">Place in {slot}</AppText>
          {decor.map((id) => (
            <Button
              key={id}
              label={`${getItem(id)?.name ?? id}${ownsItem(id) ? '' : ' · locked'}`}
              variant={home.slots[slot] === id ? 'primary' : 'ghost'}
              disabled={!ownsItem(id)}
              onPress={() => setMessage(placeDecoration(slot, id))}
              style={{ marginTop: 8 }}
            />
          ))}
          <Button label="Clear spot" variant="secondary" onPress={() => setMessage(placeDecoration(slot, null))} style={{ marginTop: 8 }} />
        </Card>
      ) : null}
      <AppText weight="800">Wallpaper</AppText>
      <Button label="Dawn walls" variant={home.wallpaper === 'dawn' ? 'primary' : 'ghost'} onPress={() => setMessage(setWallpaper('dawn'))} />
      <Button label="Starry night" variant={home.wallpaper === 'night' ? 'primary' : 'ghost'} onPress={() => setMessage(setWallpaper('night'))} />
      <Button label="Timber floor" variant={home.wallpaper === 'timber' ? 'primary' : 'ghost'} onPress={() => setMessage(setWallpaper('timber'))} />
    </Screen>
  );
}

const StyleSheetFill = { position: 'absolute' as const, top: 0, right: 0, bottom: 0, left: 0 };
