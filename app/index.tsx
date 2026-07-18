import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RingRunnerScene } from '../src/game/RingRunnerScene';
import { useGameStore } from '../src/game/store';
import { CORRIDOR } from '../src/game/types';
import { GameOverOverlay } from '../src/ui/GameOverOverlay';
import { Hud } from '../src/ui/Hud';
import { StartOverlay } from '../src/ui/StartOverlay';

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const [resetToken, setResetToken] = useState(0);
  const loadHighScore = useGameStore((s) => s.loadHighScore);
  const setSteerTarget = useGameStore((s) => s.setSteerTarget);
  const status = useGameStore((s) => s.status);

  useEffect(() => {
    void loadHighScore();
  }, [loadHighScore]);

  useEffect(() => {
    if (Platform.OS !== 'web' || status !== 'playing') {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        setSteerTarget(-CORRIDOR.halfWidth + 0.55);
      }
      if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        setSteerTarget(CORRIDOR.halfWidth - 0.55);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setSteerTarget, status]);

  const pan = Gesture.Pan()
    .runOnJS(true)
    .enabled(status === 'playing')
    .onUpdate((event) => {
      const next = (event.translationX / 140) * CORRIDOR.halfWidth;
      setSteerTarget(next);
    });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <GestureDetector gesture={pan}>
        <View style={styles.canvasWrap}>
          <RingRunnerScene resetToken={resetToken} />
          <View
            style={styles.sideControls}
            pointerEvents={status === 'playing' ? 'box-none' : 'none'}
          >
            <View
              style={styles.sideHit}
              onStartShouldSetResponder={() => status === 'playing'}
              onMoveShouldSetResponder={() => status === 'playing'}
              onResponderGrant={() => setSteerTarget(-CORRIDOR.halfWidth + 0.55)}
              onResponderMove={() => setSteerTarget(-CORRIDOR.halfWidth + 0.55)}
            />
            <View
              style={styles.sideHit}
              onStartShouldSetResponder={() => status === 'playing'}
              onMoveShouldSetResponder={() => status === 'playing'}
              onResponderGrant={() => setSteerTarget(CORRIDOR.halfWidth - 0.55)}
              onResponderMove={() => setSteerTarget(CORRIDOR.halfWidth - 0.55)}
            />
          </View>
        </View>
      </GestureDetector>

      <Hud />
      <StartOverlay />
      <GameOverOverlay
        onRetry={() => {
          setResetToken((n) => n + 1);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#061018',
  },
  canvasWrap: {
    flex: 1,
  },
  sideControls: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
  },
  sideHit: {
    flex: 1,
  },
});
