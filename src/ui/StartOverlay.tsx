import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useGameStore } from '../game/store';

export function StartOverlay() {
  const status = useGameStore((s) => s.status);
  const highScore = useGameStore((s) => s.highScore);
  const startGame = useGameStore((s) => s.startGame);

  if (status !== 'start') {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.brand}>RING RUNNER</Text>
      <Text style={styles.tagline}>Steer the glow. Thread the neon rings.</Text>
      {highScore > 0 ? (
        <Text style={styles.best}>Best run · {highScore}</Text>
      ) : null}
      <Pressable
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        onPress={startGame}
      >
        <Text style={styles.ctaText}>PLAY</Text>
      </Pressable>
      <Text style={styles.hint}>Swipe or tap sides to steer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(6, 16, 24, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  brand: {
    color: '#e8fffb',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: 'rgba(10, 255, 215, 0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  tagline: {
    marginTop: 12,
    color: '#9fd4cc',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  best: {
    marginTop: 18,
    color: '#39e6ff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cta: {
    marginTop: 36,
    backgroundColor: '#0affd7',
    paddingHorizontal: 42,
    paddingVertical: 14,
    borderRadius: 4,
  },
  ctaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    color: '#061018',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
  },
  hint: {
    marginTop: 22,
    color: '#5f8a84',
    fontSize: 13,
  },
});
