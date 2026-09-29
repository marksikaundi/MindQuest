import { useCallback, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';

import { QuestionRound } from '@/components/minigames/QuestionRound';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { art } from '@/constants/art';
import { BRIDGE_QUESTIONS } from '@/data/puzzles';
import { grantOnce, track, visitRegion } from '@/game/actions';
import { useGameTheme } from '@/hooks/use-game-theme';

const stations = [
  { id: 'bridge', label: 'Bridge', icon: 'git-network' },
  { id: 'numbers', label: 'Numbers', icon: 'calculator' },
  { id: 'memory', label: 'Memory', icon: 'albums' },
] as const;

export default function PuzzleValleyScreen() {
  const { colors } = useGameTheme();
  const [bridge, setBridge] = useState(false);
  const [score, setScore] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      visitRegion('puzzle-valley');
    }, []),
  );

  const open = (id: (typeof stations)[number]['id']) => {
    if (id === 'bridge') setBridge(true);
    if (id === 'numbers') router.push('/minigames/number-quest');
    if (id === 'memory') router.push('/minigames/memory-flip');
  };

  return (
    <Screen tabBar scroll={false} padded={false}>
      <View style={{ flex: 1, margin: 12, borderRadius: 28, overflow: 'hidden' }}>
        <Image source={art.valley} style={{ width: '100%', height: '100%' }} resizeMode="cover" accessibilityIgnoresInvertColors />
        {score ? (
          <View style={{ position: 'absolute', top: 16, alignSelf: 'center', paddingHorizontal: 14, minHeight: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.94)', justifyContent: 'center' }}>
            <AppText weight="800">{score}</AppText>
          </View>
        ) : null}
        <View style={{ position: 'absolute', left: 12, right: 12, bottom: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
          {stations.map((station) => (
            <Pressable
              key={station.id}
              accessibilityRole="button"
              accessibilityLabel={station.label}
              onPress={() => open(station.id)}
              style={{ width: 92, alignItems: 'center', gap: 6 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: station.id === 'bridge' && bridge ? colors.primary : 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={station.icon} size={28} color={station.id === 'bridge' && bridge ? '#FFFFFF' : colors.primaryDark} />
              </View>
              <AppText size={13} weight="800" color="#FFFFFF">
                {station.label}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>
      {bridge ? (
        <View style={{ marginHorizontal: 12, marginBottom: 8 }}>
          <QuestionRound
            questions={BRIDGE_QUESTIONS}
            onComplete={(correct) => {
              track('complete_puzzle', 1);
              grantOnce('bridge-token', { coins: 20 + correct * 8, xp: 25 + correct * 8, stars: correct === BRIDGE_QUESTIONS.length ? 1 : 0 }, 'bridge');
              setScore(`${correct}/${BRIDGE_QUESTIONS.length}`);
              setBridge(false);
            }}
          />
        </View>
      ) : null}
    </Screen>
  );
}
