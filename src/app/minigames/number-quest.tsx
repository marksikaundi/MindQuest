import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KenneyIcon } from '@/components/ui/KenneyIcon';
import { Screen } from '@/components/ui/Screen';
import { puzzlesFor, shuffle } from '@/data/puzzles';
import { grantReward, noteNumberCorrect, recordNumberClear, setDeferCelebrations, track } from '@/game/actions';
import { useGameTheme } from '@/hooks/use-game-theme';
import { useGameStore } from '@/stores/gameStore';
import { useSettingsStore } from '@/stores/settingsStore';
import type { BoardDifficulty } from '@/types/game';
import { playEffect } from '@/utils/feedback';
import { boardForDifficulty } from '@/utils/progression';
import { numberAnswerReward, numberRunBonus } from '@/utils/rewards';

export default function NumberQuestScreen() {
  const settingsDifficulty = useSettingsStore((state) => state.difficulty);
  const timers = useSettingsStore((state) => state.timersEnabled);
  const { colors } = useGameTheme();
  const [difficulty, setDifficulty] = useState<BoardDifficulty>(boardForDifficulty(settingsDifficulty));
  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => shuffle(puzzlesFor(difficulty)).slice(0, 8), [difficulty, seed]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [bonus, setBonus] = useState<ReturnType<typeof numberRunBonus> | null>(null);

  useEffect(() => {
    setDeferCelebrations(true);
    return () => setDeferCelebrations(false);
  }, []);

  useEffect(() => {
    if (phase !== 'play' || !timers || difficulty === 'easy') return;
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [difficulty, phase, timers]);

  const question = questions[index];

  const start = (next: BoardDifficulty) => {
    setDifficulty(next);
    setSeed((value) => value + 1);
    setIndex(0);
    setPicked(null);
    setCorrect(0);
    setSeconds(0);
    setBonus(null);
    setPhase('play');
  };

  const finish = (correctCount: number) => {
    const first = useGameStore.getState().minigames.number.played === 0;
    const extra = numberRunBonus(correctCount, questions.length, first);
    recordNumberClear(correctCount * 100);
    grantReward(extra, 'number');
    track('complete_number_quest', 1);
    track('complete_puzzle', 1);
    setBonus(extra);
    setPhase('result');
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText size={26} weight="800">Number Quest</AppText>
        <Button label="Exit" variant="ghost" onPress={() => router.back()} style={{ minWidth: 88 }} />
      </View>
      {phase === 'intro' ? (
        <Card>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <Button key={level} label={level} variant={difficulty === level ? 'primary' : 'ghost'} onPress={() => setDifficulty(level)} style={{ flex: 1 }} />
            ))}
          </View>
          <Button label="Play" onPress={() => start(difficulty)} style={{ marginTop: 12 }} />
        </Card>
      ) : null}
      {phase === 'play' && question ? (
        <Card>
          <AppText weight="800">
            Question {index + 1}/{questions.length} · Correct {correct}
            {timers && difficulty !== 'easy' ? ` · ${seconds}s` : ''}
          </AppText>
          <AppText size={28} weight="800" center style={{ marginVertical: 16 }}>
            {question.shown.join(' → ')} → ?
          </AppText>
          <View style={{ gap: 8 }}>
            {question.options.map((option) => {
              const showAnswer = picked !== null && option === question.answer;
              const chosen = picked === option;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  disabled={picked !== null}
                  onPress={() => {
                    setPicked(option);
                    const hit = option === question.answer;
                    if (hit) {
                      setCorrect((count) => count + 1);
                      noteNumberCorrect();
                      grantReward(numberAnswerReward(), 'number');
                    }
                    void playEffect(hit ? 'success' : 'error');
                  }}
                  style={{ minHeight: 58, borderRadius: 16, justifyContent: 'center', paddingHorizontal: 16, backgroundColor: showAnswer ? '#E5F6EE' : chosen ? '#FDE8EC' : colors.background, borderWidth: 2, borderColor: showAnswer ? colors.success : chosen ? colors.danger : colors.line }}>
                  <AppText weight="800">
                    {option} {showAnswer ? '✓' : chosen ? '✗' : ''}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
          {picked !== null ? (
            <View style={{ marginTop: 12, gap: 8 }}>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <KenneyIcon name={picked === question.answer ? 'checkmark' : 'cross'} color={picked === question.answer ? colors.success : colors.danger} />
                <AppText weight="800" color={picked === question.answer ? colors.success : colors.danger}>
                  {picked === question.answer ? 'Correct · +20 XP · +15 coins' : 'Not quite'}
                </AppText>
              </View>
              {picked !== question.answer ? <AppText>{question.explanation}</AppText> : <AppText>The pattern holds.</AppText>}
              <Button
                label={index + 1 === questions.length ? 'See results' : 'Continue'}
                onPress={() => {
                  if (index + 1 === questions.length) finish(correct);
                  else {
                    setIndex((value) => value + 1);
                    setPicked(null);
                  }
                }}
              />
            </View>
          ) : null}
        </Card>
      ) : null}
      {phase === 'result' && bonus ? (
        <Card>
          <AppText size={30} weight="800" center>Quest complete</AppText>
          <AppText center>Correct answers {correct}/{questions.length}</AppText>
          <AppText center>Bonus coins {bonus.coins}</AppText>
          <AppText center>Bonus XP {bonus.xp}</AppText>
          <AppText center>Stars earned {bonus.stars}</AppText>
          <Button label="Play Again" onPress={() => start(difficulty)} style={{ marginTop: 12 }} />
          <Button label="Continue" variant="secondary" onPress={() => router.replace('/minigames')} />
        </Card>
      ) : null}
    </Screen>
  );
}
