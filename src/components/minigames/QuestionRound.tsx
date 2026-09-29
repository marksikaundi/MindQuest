import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KenneyIcon } from '@/components/ui/KenneyIcon';
import type { LogicQuestion } from '@/data/puzzles';
import { useGameTheme } from '@/hooks/use-game-theme';
import { playEffect } from '@/utils/feedback';

export function QuestionRound({
  questions,
  onComplete,
}: {
  questions: LogicQuestion[];
  onComplete: (correct: number) => void;
}) {
  const { colors, colorFriendly } = useGameTheme();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const question = questions[index];

  if (!question) return null;
  const correct = picked !== null && picked === question.answer;

  return (
    <Card>
      <AppText size={13} weight="800" color={colors.muted}>
        Question {index + 1} / {questions.length}
      </AppText>
      <AppText size={18} weight="800" style={{ marginTop: 8 }}>
        {question.prompt}
      </AppText>
      <View style={{ gap: 8, marginTop: 14 }}>
        {question.options.map((option, optionIndex) => {
          const chosen = picked === optionIndex;
          const show = picked !== null && optionIndex === question.answer;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              disabled={picked !== null}
              onPress={() => {
                setPicked(optionIndex);
                const hit = optionIndex === question.answer;
                if (hit) setCorrectCount((count) => count + 1);
                void playEffect(hit ? 'success' : 'error');
              }}
              style={{
                minHeight: 52,
                borderRadius: 16,
                paddingHorizontal: 14,
                justifyContent: 'center',
                backgroundColor: show ? '#E5F6EE' : chosen ? '#FDE8EC' : colors.background,
                borderWidth: 2,
                borderColor: show ? colors.success : chosen ? colors.danger : colors.line,
              }}>
              <AppText weight="700">
                {colorFriendly ? `${optionIndex + 1}. ` : ''}
                {option} {show ? '✓' : chosen && !correct ? '✗' : ''}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {picked !== null ? (
        <View style={{ marginTop: 12, gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <KenneyIcon name={correct ? 'checkmark' : 'cross'} color={correct ? colors.success : colors.danger} />
            <AppText weight="800" color={correct ? colors.success : colors.danger}>
              {correct ? 'Correct' : 'Not quite'}
            </AppText>
          </View>
          <AppText>{question.explanation}</AppText>
          <Button
            label={index + 1 === questions.length ? 'Finish' : 'Continue'}
            onPress={() => {
              if (index + 1 === questions.length) onComplete(correctCount);
              else {
                setIndex((value) => value + 1);
                setPicked(null);
              }
            }}
          />
        </View>
      ) : null}
    </Card>
  );
}
