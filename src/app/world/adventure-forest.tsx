import { useCallback, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { MemoryGlyph } from '@/components/minigames/Symbols';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { art } from '@/constants/art';
import { findHiddenObject, finishForestSearch, visitRegion } from '@/game/actions';
import { useGameTheme } from '@/hooks/use-game-theme';
import { useReducedMotion } from '@/hooks/use-game-theme';
import { useQuestStore } from '@/stores/questStore';

const objects = [
  { id: 'key', label: 'Key', symbol: 'key', top: '62%', left: '12%' },
  { id: 'leaf', label: 'Leaf', symbol: 'leaf', top: '22%', left: '70%' },
  { id: 'star', label: 'Star', symbol: 'star', top: '46%', left: '38%' },
  { id: 'mushroom', label: 'Mushroom', symbol: 'mushroom', top: '70%', left: '74%' },
  { id: 'crystal', label: 'Crystal', symbol: 'crystal', top: '30%', left: '18%' },
] as const;

export default function AdventureForestScreen() {
  const { colors } = useGameTheme();
  const reduced = useReducedMotion();
  const questsDone = useQuestStore((state) => state.claimedIds.length);
  const [found, setFound] = useState<string[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [rewarded, setRewarded] = useState(false);
  const [message, setMessage] = useState('Find 5 hidden objects.');

  useFocusEffect(
    useCallback(() => {
      visitRegion('adventure-forest');
    }, []),
  );

  if (questsDone < 1) {
    return (
      <Screen>
        <AppText size={28} weight="800">
          Adventure Forest
        </AppText>
        <AppText>Complete 1 quest to unlock.</AppText>
        <Button label="Back to map" onPress={() => router.back()} />
      </Screen>
    );
  }

  const remaining = objects.filter((object) => !found.includes(object.id));

  const collect = (id: string, label: string) => {
    if (found.includes(id)) return;
    const next = [...found, id];
    setFound(next);
    findHiddenObject(id);
    setHint(null);
    if (next.length === objects.length && !rewarded) {
      const first = finishForestSearch();
      setRewarded(true);
      setMessage(first ? 'The chest opens. Coins, XP, and a star are yours.' : 'You searched the grove again and found a smaller reward.');
      return;
    }
    setMessage(`${label} found. ${next.length}/5`);
  };

  return (
    <Screen tabBar={false}>
      <AppText size={28} weight="800">
        Adventure Forest
      </AppText>
      <AppText color={colors.muted}>{message}</AppText>
      <View style={{ height: 460, borderRadius: 28, overflow: 'hidden' }}>
        <Image source={art.forest} style={{ width: '100%', height: '100%' }} resizeMode="cover" accessibilityIgnoresInvertColors />
        {objects.map((object) => {
          const taken = found.includes(object.id);
          const highlighted = hint === object.id && !taken;
          return (
            <Pressable
              key={object.id}
              accessibilityRole="button"
              accessibilityLabel={taken ? `${object.label} found` : 'Hidden object'}
              onPress={() => collect(object.id, object.label)}
              style={{
                position: 'absolute',
                top: object.top,
                left: object.left,
                width: 56,
                height: 56,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: taken ? 'rgba(255,255,255,0.9)' : highlighted ? 'rgba(255,200,87,0.85)' : 'rgba(255,255,255,0.28)',
                borderWidth: highlighted || taken ? 2 : 0,
                borderColor: colors.ink,
                opacity: taken || highlighted || reduced ? 1 : 0.85,
              }}>
              <MemoryGlyph symbol={object.symbol} size={32} />
            </Pressable>
          );
        })}
      </View>
      <Card>
        <AppText weight="800">
          {found.length}/5 objects
        </AppText>
        <AppText color={colors.muted}>Look for a key, leaf, star, mushroom, and crystal. Shapes stay visible so color is not the only clue.</AppText>
        <Button
          label="Hint"
          variant="secondary"
          onPress={() => setHint(remaining[0]?.id ?? null)}
          disabled={remaining.length === 0}
        />
        <Button
          label="Search again"
          variant="ghost"
          onPress={() => {
            setFound([]);
            setRewarded(false);
            setHint(null);
            setMessage('A new breeze moves the leaves. Find the five objects again.');
          }}
        />
        <Button label="Back to map" variant="ghost" onPress={() => router.back()} />
      </Card>
    </Screen>
  );
}
