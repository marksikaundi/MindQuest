import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useGameStore } from '../game/store';

interface GameOverOverlayProps {
  onRetry: () => void;
}

export function GameOverOverlay({ onRetry }: GameOverOverlayProps) {
  const status = useGameStore((s) => s.status);
  const score = useGameStore((s) => s.score);
  const highScore = useGameStore((s) => s.highScore);
  const startGame = useGameStore((s) => s.startGame);

  if (status !== 'gameover') {
    return null;
  }

  const isBest = score > 0 && score >= highScore;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>SIGNAL LOST</Text>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.sub}>
        {isBest ? 'New best run' : `Best · ${highScore}`}
      </Text>
      <Pressable
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        onPress={() => {
          onRetry();
          startGame();
        }}
      >
        <Text style={styles.ctaText}>RETRY</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 16, 24, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: {
    color: '#ff8aa0',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 4,
  },
  score: {
    marginTop: 16,
    color: '#e8fffb',
    fontSize: 64,
    fontWeight: '900',
  },
  sub: {
    marginTop: 8,
    color: '#9fd4cc',
    fontSize: 15,
  },
  cta: {
    marginTop: 36,
    backgroundColor: '#39e6ff',
    paddingHorizontal: 42,
    paddingVertical: 14,
    borderRadius: 4,
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaText: {
    color: '#061018',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
  },
});
