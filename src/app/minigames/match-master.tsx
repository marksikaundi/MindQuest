import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { ShapeGlyph } from '@/components/minigames/Symbols';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KenneyIcon } from '@/components/ui/KenneyIcon';
import { Screen } from '@/components/ui/Screen';
import { MATCH_COLORS, MATCH_PATTERNS, MATCH_SHAPES, type MatchTile } from '@/data/minigames';
import { shuffle } from '@/data/puzzles';
import { grantReward, recordMatchClear, setDeferCelebrations, track } from '@/game/actions';
import { useGameTheme } from '@/hooks/use-game-theme';
import { useReducedMotion } from '@/hooks/use-game-theme';
import { useGameStore } from '@/stores/gameStore';
import { useSettingsStore } from '@/stores/settingsStore';
import type { Difficulty } from '@/types/game';
import { playEffect } from '@/utils/feedback';
import { matchResult } from '@/utils/rewards';

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)] as T;
}

function makeTile(): MatchTile {
  return { shape: pick(MATCH_SHAPES), color: pick(MATCH_COLORS).id, pattern: pick(MATCH_PATTERNS) };
}

function matches(a: MatchTile, b: MatchTile, mode: Difficulty) {
  if (a.shape !== b.shape) return false;
  if (mode === 'relaxed') return true;
  if (a.color !== b.color) return false;
  if (mode === 'standard') return true;
  return a.pattern === b.pattern;
}

function roundFor(mode: Difficulty) {
  const target = makeTile();
  const count = mode === 'relaxed' ? 4 : mode === 'standard' ? 6 : 8;
  const options = [target];
  while (options.length < count) {
    const next = makeTile();
    if (!matches(target, next, mode)) options.push(next);
  }
  return { target, options: shuffle(options) };
}

export default function MatchMasterScreen() {
  const settingsDifficulty = useSettingsStore((state) => state.difficulty);
  const timers = useSettingsStore((state) => state.timersEnabled);
  const { colors, colorFriendly } = useGameTheme();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<Difficulty>(settingsDifficulty);
  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [round, setRound] = useState(0);
  const [total, setTotal] = useState(8);
  const [board, setBoard] = useState(roundFor('standard'));
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [seconds, setSeconds] = useState(20);
  const [reward, setReward] = useState<ReturnType<typeof matchResult> | null>(null);

  useEffect(() => {
    setDeferCelebrations(true);
    return () => setDeferCelebrations(false);
  }, []);

  useEffect(() => {
    if (phase !== 'play' || !timers || mode !== 'challenge') return;
    const timer = setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setCombo(0);
          setFeedback('Time is up. The next shape is ready.');
          setBoard(roundFor(mode));
          return 20;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, phase, timers]);

  const start = (next: Difficulty) => {
    const rounds = next === 'relaxed' ? 6 : next === 'challenge' ? 10 : 8;
    setMode(next);
    setTotal(rounds);
    setRound(0);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setFeedback('');
    setSeconds(20);
    setReward(null);
    setBoard(roundFor(next));
    setPhase('play');
  };

  const choose = (tile: MatchTile) => {
    const hit = matches(tile, board.target, mode);
    const nextCombo = hit ? combo + 1 : 0;
    const gain = hit ? 100 + combo * 20 : 0;
    const nextScore = score + gain;
    const nextBest = Math.max(bestCombo, nextCombo);
    const nextRound = round + 1;
    setCombo(nextCombo);
    setBestCombo(nextBest);
    setScore(nextScore);
    setFeedback(hit ? `Match! Combo ${nextCombo}` : 'Not this one. Look at the shape and the pattern.');
    void playEffect(hit ? 'success' : 'error');
    if (nextRound >= total) {
      const first = useGameStore.getState().minigames.match.played === 0;
      const payout = matchResult(nextScore, nextBest, first);
      recordMatchClear(nextScore, nextBest);
      grantReward(payout, 'match');
      track('complete_match_master', 1);
      track('complete_puzzle', 1);
      setReward(payout);
      setPhase('result');
      return;
    }
    setRound(nextRound);
    setBoard(roundFor(mode));
    setSeconds(20);
  };

  const colorHex = (id: string) => MATCH_COLORS.find((color) => color.id === id)?.hex ?? colors.primary;
  const colorLabel = (id: string) => MATCH_COLORS.find((color) => color.id === id)?.label ?? id;

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText size={26} weight="800">Match Master</AppText>
        <Button label="Exit" variant="ghost" onPress={() => router.back()} style={{ minWidth: 88 }} />
      </View>
      {phase === 'intro' ? (
        <Card>
          <AppText>Match the target. Relaxed mode asks only for the shape. Standard adds color. Challenge adds a pattern too.</AppText>
          <AppText color={colors.muted} style={{ marginTop: 8 }}>The pace stays calm. A timer appears only in Challenge when timers are on.</AppText>
          <View style={{ gap: 8, marginTop: 12 }}>
            {(['relaxed', 'standard', 'challenge'] as const).map((level) => (
              <Button key={level} label={level} variant={mode === level ? 'primary' : 'ghost'} onPress={() => setMode(level)} />
            ))}
          </View>
          <Button label="Play" onPress={() => start(mode)} />
        </Card>
      ) : null}
      {phase === 'play' ? (
        <View style={{ gap: 12 }}>
          <AppText weight="800">
            Round {round + 1}/{total} · Score {score} · Combo {combo}
            {timers && mode === 'challenge' ? ` · ${seconds}s` : ''}
          </AppText>
          <Card>
            <AppText weight="800">Find this</AppText>
            <View style={{ alignItems: 'center', marginTop: 8 }}>
              <ShapeGlyph shape={board.target.shape} color={colorHex(board.target.color)} pattern={colorFriendly || mode === 'challenge' ? board.target.pattern : 'solid'} />
              <AppText weight="800">
                {board.target.shape}
                {mode !== 'relaxed' ? ` · ${colorLabel(board.target.color)}` : ''}
                {mode === 'challenge' || colorFriendly ? ` · ${board.target.pattern}` : ''}
              </AppText>
            </View>
          </Card>
          {feedback ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <KenneyIcon name={feedback.startsWith('Match') ? 'checkmark' : 'cross'} color={feedback.startsWith('Match') ? colors.success : colors.danger} />
              <AppText weight="700">{feedback}</AppText>
            </View>
          ) : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {board.options.map((tile, index) => (
              <Pressable key={`${tile.shape}-${tile.color}-${tile.pattern}-${index}`} accessibilityRole="button" accessibilityLabel={`${tile.shape} ${colorLabel(tile.color)} ${tile.pattern}`} onPress={() => choose(tile)} style={{ width: '30%', minHeight: 96, borderRadius: 18, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
                {reduced ? null : <Animated.View entering={ZoomIn.duration(180)} />}
                <ShapeGlyph shape={tile.shape} color={colorHex(tile.color)} pattern={tile.pattern} size={36} />
                <AppText size={11} weight="700">{tile.shape}</AppText>
              </Pressable>
            ))}
          </View>
          <Button label="Restart" variant="secondary" onPress={() => start(mode)} />
        </View>
      ) : null}
      {phase === 'result' && reward ? (
        <Card>
          <AppText size={30} weight="800" center>Nice matching!</AppText>
          <AppText center>Score {reward.score}</AppText>
          <AppText center>Best combo {bestCombo}</AppText>
          <AppText center>Coins earned {reward.coins}</AppText>
          <AppText center>XP earned {reward.xp}</AppText>
          <AppText center>Stars earned {reward.stars}</AppText>
          <Button label="Play Again" onPress={() => start(mode)} style={{ marginTop: 12 }} />
          <Button label="Continue" variant="secondary" onPress={() => router.replace('/minigames')} />
        </Card>
      ) : null}
    </Screen>
  );
}
