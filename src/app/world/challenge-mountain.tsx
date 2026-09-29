import { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { KenneyIcon } from '@/components/ui/KenneyIcon';
import { Screen } from '@/components/ui/Screen';
import { art } from '@/constants/art';
import { puzzlesFor, shuffle } from '@/data/puzzles';
import { grantOnce, grantReward, noteNumberCorrect, track, visitRegion } from '@/game/actions';
import { useGameTheme } from '@/hooks/use-game-theme';
import { useQuestStore } from '@/stores/questStore';
import { numberAnswerReward } from '@/utils/rewards';
import { playEffect } from '@/utils/feedback';

export default function ChallengeMountainScreen() {
  const questsDone = useQuestStore((state) => state.claimedIds.length);
  const { colors } = useGameTheme();
  const questions = useMemo(() => shuffle(puzzlesFor('hard')).slice(0, 5), []);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  useFocusEffect(useCallback(() => visitRegion('challenge-mountain'), []));

  if (questsDone < 6) {
    return (
      <Screen>
        <AppText size={28} weight="800">Challenge Mountain</AppText>
        <AppText>Complete 6 quests to unlock.</AppText>
        <Button label="Back to map" onPress={() => router.back()} />
      </Screen>
    );
  }

  const question = questions[index];

  return (
    <Screen tabBar>
      <Image source={art.mountain} style={{ width: '100%', height: 200, borderRadius: 28 }} resizeMode="cover" />
      <AppText size={28} weight="800">Challenge Mountain</AppText>
      {finished || !question ? (
        <View style={{ gap: 10 }}>
          <AppText>You answered {correctCount}/5 on the steep path.</AppText>
          <Button label="Back to map" onPress={() => router.back()} />
        </View>
      ) : (
        <View style={{ gap: 10 }}>
          <AppText weight="800">
            {question.shown.join(' → ')} → ?
          </AppText>
          {question.options.map((option) => (
            <Pressable
              key={option}
              disabled={picked !== null}
              onPress={() => {
                setPicked(option);
                const hit = option === question.answer;
                if (hit) {
                  setCorrectCount((count) => count + 1);
                  noteNumberCorrect();
                  grantReward(numberAnswerReward(), 'mountain');
                }
                void playEffect(hit ? 'success' : 'error');
              }}
              style={{ minHeight: 54, borderRadius: 16, justifyContent: 'center', paddingHorizontal: 14, backgroundColor: colors.surface }}>
              <AppText weight="800">{option}</AppText>
            </Pressable>
          ))}
          {picked !== null ? (
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <KenneyIcon name={picked === question.answer ? 'checkmark' : 'cross'} color={picked === question.answer ? colors.success : colors.danger} />
                <AppText weight="800">{picked === question.answer ? 'Correct' : 'Not quite'}</AppText>
              </View>
              <AppText>{question.explanation}</AppText>
              <Button
                label={index === questions.length - 1 ? 'Finish climb' : 'Next'}
                onPress={() => {
                  if (index === questions.length - 1) {
                    track('complete_puzzle', 1);
                    grantOnce('summit-flag', { coins: 30, xp: 40, stars: correctCount === 5 ? 1 : 0 }, 'mountain');
                    setFinished(true);
                  } else {
                    setIndex((value) => value + 1);
                    setPicked(null);
                  }
                }}
              />
            </View>
          ) : null}
        </View>
      )}
    </Screen>
  );
}
