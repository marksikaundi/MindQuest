import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { useGameStore } from '../game/store';

export function Hud() {
  const score = useGameStore((s) => s.score);
  const highScore = useGameStore((s) => s.highScore);
  const status = useGameStore((s) => s.status);
  const scorePulseAt = useGameStore((s) => s.scorePulseAt);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (scorePulseAt <= 0) {
      return;
    }
    scale.setValue(1.28);
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 160,
      useNativeDriver: true,
    }).start();
  }, [scorePulseAt, scale]);

  if (status !== 'playing') {
    return null;
  }

  return (
    <View style={styles.wrap} pointerEvents="none">
      <Animated.Text style={[styles.score, { transform: [{ scale }] }]}>
        {score}
      </Animated.Text>
      <Text style={styles.best}>BEST {highScore}</Text>
      <View style={styles.speedBarTrack}>
        <View
          style={[
            styles.speedBarFill,
            { width: `${Math.min(100, 28 + score * 3)}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  score: {
    color: '#e8fffb',
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: 3,
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(57, 230, 255, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  best: {
    marginTop: 2,
    color: '#7eb8b0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 4,
  },
  speedBarTrack: {
    marginTop: 14,
    width: 120,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(57, 230, 255, 0.15)',
    overflow: 'hidden',
  },
  speedBarFill: {
    height: '100%',
    backgroundColor: '#0affd7',
  },
});
