import { useEffect, useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { MemoryGlyph } from '@/components/minigames/Symbols';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { MEMORY_SYMBOLS, type MemorySymbol } from '@/data/minigames';
import { shuffle } from '@/data/puzzles';
import { grantReward, recordMemoryClear, setDeferCelebrations, track } from '@/game/actions';
import { useGameTheme } from '@/hooks/use-game-theme';
import { useReducedMotion } from '@/hooks/use-game-theme';
import { useGameStore } from '@/stores/gameStore';
import { useSettingsStore } from '@/stores/settingsStore';
import type { BoardDifficulty } from '@/types/game';
import { createId } from '@/utils/id';
import { boardForDifficulty } from '@/utils/progression';
import { memoryResult } from '@/utils/rewards';
import { playEffect } from '@/utils/feedback';

type CardModel = { uid: string; symbol: MemorySymbol; faceUp: boolean; matched: boolean };

const counts: Record<BoardDifficulty, number> = { easy: 6, medium: 12, hard: 18 };

function makeDeck(count: number): CardModel[] {
  const symbols = shuffle([...MEMORY_SYMBOLS]).slice(0, count / 2);
  return shuffle(
    symbols.flatMap((symbol) => [
      { uid: createId(), symbol, faceUp: false, matched: false },
      { uid: `${createId()}-b`, symbol, faceUp: false, matched: false },
    ]),
  );
}

export default function MemoryFlipScreen() {
  const settingsDifficulty = useSettingsStore((state) => state.difficulty);
  const timers = useSettingsStore((state) => state.timersEnabled);
  const [difficulty, setDifficulty] = useState<BoardDifficulty>(boardForDifficulty(settingsDifficulty));
  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [cards, setCards] = useState<CardModel[]>([]);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<ReturnType<typeof memoryResult> | null>(null);
  const { width } = useWindowDimensions();
  const { colors } = useGameTheme();
  const reduced = useReducedMotion();

  useEffect(() => {
    setDeferCelebrations(true);
    return () => setDeferCelebrations(false);
  }, []);

  useEffect(() => {
    if (phase !== 'play' || !timers) return;
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timers]);

  const start = (next = difficulty) => {
    setDifficulty(next);
    setCards(makeDeck(counts[next]));
    setMoves(0);
    setSeconds(0);
    setLock(false);
    setResult(null);
    setPhase('play');
  };

  const finish = (finalMoves: number, board: BoardDifficulty) => {
    const first = useGameStore.getState().minigames.memory.clears[board] === 0;
    const reward = memoryResult(counts[board] / 2, finalMoves, board, first);
    recordMemoryClear(board, reward.score);
    grantReward(reward, 'memory');
    track('complete_memory_flip', 1);
    track('match_all_pairs', 1);
    track('complete_puzzle', 1);
    setResult(reward);
    setPhase('result');
    void playEffect('reward');
  };

  const tap = (index: number) => {
    if (lock || phase !== 'play') return;
    const card = cards[index];
    if (!card || card.faceUp || card.matched) return;
    const opened = cards.map((item, itemIndex) => (itemIndex === index ? { ...item, faceUp: true } : item));
    const visible = opened.filter((item) => item.faceUp && !item.matched);
    if (visible.length < 2) {
      setCards(opened);
      return;
    }
    const nextMoves = moves + 1;
    setMoves(nextMoves);
    const [first, second] = visible;
    if (first && second && first.symbol === second.symbol) {
      const matched = opened.map((item) => (item.symbol === first.symbol ? { ...item, faceUp: true, matched: true } : item));
      setCards(matched);
      void playEffect('success');
      if (matched.every((item) => item.matched)) finish(nextMoves, difficulty);
      return;
    }
    setCards(opened);
    setLock(true);
    void playEffect('error');
    setTimeout(() => {
      setCards((current) => current.map((item) => (item.matched ? item : { ...item, faceUp: false })));
      setLock(false);
    }, reduced ? 180 : 700);
  };

  const columns = difficulty === 'hard' ? 3 : 3;
  const cardSize = Math.min(108, Math.floor((Math.min(width, 760) - 48 - (columns - 1) * 8) / columns));

  return (
    <Screen scroll>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText size={26} weight="800">
          Memory Flip
        </AppText>
        <Button label="Exit" variant="ghost" onPress={() => router.back()} style={{ minWidth: 88 }} />
      </View>
      {phase === 'intro' ? (
        <Card>
          <AppText>Tap two cards. Matches stay face up. Misses turn back over.</AppText>
          <AppText color={colors.muted} style={{ marginTop: 8 }}>
            Easy is 6 cards, medium is 12, and hard is 18. Shapes are unique, so you do not need color alone.
          </AppText>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <Button key={level} label={level} variant={difficulty === level ? 'primary' : 'ghost'} onPress={() => setDifficulty(level)} style={{ flex: 1 }} />
            ))}
          </View>
          <Button label="Play" onPress={() => start(difficulty)} style={{ marginTop: 12 }} />
        </Card>
      ) : null}
      {phase === 'play' ? (
        <View style={{ gap: 12 }}>
          <AppText weight="800">
            Moves {moves}
            {timers ? ` · Time ${seconds}s` : ''}
          </AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {cards.map((card, index) => (
              <MemoryCard key={card.uid} card={card} size={cardSize} reduced={reduced} onPress={() => tap(index)} />
            ))}
          </View>
          <Button label="Restart" variant="secondary" onPress={() => start(difficulty)} />
        </View>
      ) : null}
      {phase === 'result' && result ? (
        <Card>
          <AppText size={32} weight="800" center>
            Memory Master!
          </AppText>
          <AppText center style={{ marginTop: 8 }}>
            Score {result.score}
          </AppText>
          <AppText center>Coins earned {result.coins}</AppText>
          <AppText center>XP earned {result.xp}</AppText>
          <AppText center>Stars earned {result.stars}</AppText>
          <Button label="Play Again" onPress={() => start(difficulty)} style={{ marginTop: 12 }} />
          <Button label="Continue" variant="secondary" onPress={() => router.replace('/minigames')} />
        </Card>
      ) : null}
    </Screen>
  );
}

function MemoryCard({ card, size, onPress, reduced }: { card: CardModel; size: number; onPress: () => void; reduced: boolean }) {
  const { colors } = useGameTheme();
  const flip = useSharedValue(card.faceUp || card.matched ? 1 : 0);
  useEffect(() => {
    flip.value = withTiming(card.faceUp || card.matched ? 1 : 0, { duration: reduced ? 1 : 180 });
  }, [card.faceUp, card.matched, flip, reduced]);
  const front = useAnimatedStyle(() => ({ opacity: flip.value }));
  const back = useAnimatedStyle(() => ({ opacity: 1 - flip.value }));
  const shown = card.faceUp || card.matched;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={shown ? card.symbol : 'Face down card'} onPress={onPress} style={{ width: size, height: size * 1.25 }}>
      <Animated.View style={[{ position: 'absolute', inset: 0, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, back]}>
        <AppText weight="800" color="#FFFFFF">
          ?
        </AppText>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', inset: 0, borderRadius: 16, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: card.matched ? colors.success : colors.line }, front]}>
        <MemoryGlyph symbol={card.symbol} />
        <AppText size={11} weight="700">
          {card.symbol}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}
