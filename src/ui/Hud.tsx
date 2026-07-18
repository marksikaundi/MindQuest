import { StyleSheet, Text, View } from 'react-native';

import { useGameStore } from '../game/store';

export function Hud() {
  const score = useGameStore((s) => s.score);
  const highScore = useGameStore((s) => s.highScore);
  const status = useGameStore((s) => s.status);

  if (status !== 'playing') {
    return null;
  }

  return (
    <View style={styles.wrap} pointerEvents="none">
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.best}>BEST {highScore}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  score: {
    color: '#e8fffb',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 2,
    textShadowColor: 'rgba(57, 230, 255, 0.55)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  best: {
    marginTop: 4,
    color: '#7eb8b0',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 3,
  },
});
