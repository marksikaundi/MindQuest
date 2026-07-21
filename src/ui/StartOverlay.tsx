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
      <View style={styles.glow} />
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
      <Text style={styles.hint}>Drag to steer · A / D on web</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(4, 12, 20, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(10, 255, 215, 0.08)',
  },
  brand: {
    color: '#e8fffb',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 5,
    textShadowColor: 'rgba(10, 255, 215, 0.55)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 22,
  },
  tagline: {
    marginTop: 14,
    color: '#9fd4cc',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  best: {
    marginTop: 20,
    color: '#39e6ff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  cta: {
    marginTop: 40,
    backgroundColor: '#0affd7',
    paddingHorizontal: 48,
    paddingVertical: 15,
    borderRadius: 2,
    shadowColor: '#0affd7',
    shadowOpacity: 0.45,
    shadowRadius: 18,
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
  hint: {
    marginTop: 24,
    color: '#5f8a84',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
