import { useCallback, useState } from 'react';
import { Image } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { QuestionRound } from '@/components/minigames/QuestionRound';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { art } from '@/constants/art';
import { KNOWLEDGE_QUESTIONS } from '@/data/puzzles';
import { grantOnce, track, visitRegion } from '@/game/actions';
import { useQuestStore } from '@/stores/questStore';

export default function KnowledgeIslandScreen() {
  const questsDone = useQuestStore((state) => state.claimedIds.length);
  const [done, setDone] = useState(false);
  useFocusEffect(useCallback(() => visitRegion('knowledge-island'), []));

  if (questsDone < 4) {
    return (
      <Screen>
        <AppText size={28} weight="800">Knowledge Island</AppText>
        <AppText>Complete 4 quests to unlock.</AppText>
        <Button label="Back to map" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen tabBar>
      <Image source={art.island} style={{ width: '100%', height: 220, borderRadius: 28 }} resizeMode="cover" />
      <AppText size={28} weight="800">Knowledge Island</AppText>
      {done ? <AppText>The cottage lantern stays lit. You can travel on.</AppText> : null}
      {!done ? (
        <QuestionRound
          questions={KNOWLEDGE_QUESTIONS}
          onComplete={(correct) => {
            track('complete_puzzle', 1);
            grantOnce('island-shell', { coins: 20 + correct * 10, xp: 20 + correct * 10, stars: correct === 3 ? 1 : 0 }, 'island');
            setDone(true);
          }}
        />
      ) : (
        <Button label="Back to map" onPress={() => router.back()} />
      )}
    </Screen>
  );
}
