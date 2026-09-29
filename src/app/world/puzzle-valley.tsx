import { useCallback, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { QuestionRound } from '@/components/minigames/QuestionRound';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { art } from '@/constants/art';
import { BRIDGE_QUESTIONS } from '@/data/puzzles';
import { grantOnce, track, visitRegion } from '@/game/actions';
import { useGameTheme } from '@/hooks/use-game-theme';

export default function PuzzleValleyScreen() {
  const { colors } = useGameTheme();
  const [bridge, setBridge] = useState(false);
  const [note, setNote] = useState('Choose a station along the stone path.');

  useFocusEffect(
    useCallback(() => {
      visitRegion('puzzle-valley');
    }, []),
  );

  return (
    <Screen tabBar>
      <Image source={art.valley} style={{ width: '100%', height: 220, borderRadius: 28 }} resizeMode="cover" accessibilityIgnoresInvertColors />
      <AppText size={28} weight="800">
        Puzzle Valley
      </AppText>
      <AppText color={colors.muted}>{note}</AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        <Station label="Bridge Keeper" detail="A short logic path" onPress={() => setBridge(true)} />
        <Station label="Number Tower" detail="Open Number Quest" onPress={() => router.push('/minigames/number-quest')} />
        <Station label="Memory Stones" detail="Open Memory Flip" onPress={() => router.push('/minigames/memory-flip')} />
      </View>
      {bridge ? (
        <QuestionRound
          questions={BRIDGE_QUESTIONS}
          onComplete={(correct) => {
            track('complete_puzzle', 1);
            grantOnce('bridge-token', { coins: 20 + correct * 8, xp: 25 + correct * 8, stars: correct === BRIDGE_QUESTIONS.length ? 1 : 0 }, 'bridge');
            setNote(`Bridge cleared. ${correct}/${BRIDGE_QUESTIONS.length} answers were right.`);
            setBridge(false);
          }}
        />
      ) : (
        <Card>
          <AppText weight="800">Hills, bridges, and towers</AppText>
          <AppText color={colors.muted}>Take your time. Relaxed mode in Settings slows nothing down and keeps timers off unless you want them.</AppText>
          <Button label="Back to map" variant="ghost" onPress={() => router.back()} />
        </Card>
      )}
    </Screen>
  );
}

function Station({ label, detail, onPress }: { label: string; detail: string; onPress: () => void }) {
  const { colors } = useGameTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{ width: '48%', minHeight: 88, borderRadius: 18, backgroundColor: colors.surface, padding: 12, justifyContent: 'center' }}>
      <AppText weight="800">{label}</AppText>
      <AppText size={13} color={colors.muted}>
        {detail}
      </AppText>
    </Pressable>
  );
}
