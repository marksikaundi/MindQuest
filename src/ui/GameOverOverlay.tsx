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
      <Text style={[styles.sub, isBest && styles.subBest]}>
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
    backgroundColor: 'rgba(4, 12, 20, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: {
    color: '#ff8aa0',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 5,
    textShadowColor: 'rgba(255, 77, 109, 0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  score: {
    marginTop: 18,
    color: '#e8fffb',
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  sub: {
    marginTop: 8,
    color: '#9fd4cc',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  subBest: {
    color: '#0affd7',
    fontWeight: '700',
  },
  cta: {
    marginTop: 40,
    backgroundColor: '#39e6ff',
    paddingHorizontal: 48,
    paddingVertical: 15,
    borderRadius: 2,
    shadowColor: '#39e6ff',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  ctaPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
  ctaText: {
    color: '#040c14',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 4,
  },
});
