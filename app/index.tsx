import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RingRunnerScene } from '../src/game/RingRunnerScene';
import { useGameStore } from '../src/game/store';
import { CORRIDOR, SHIP_RADIUS } from '../src/game/types';
import { GameOverOverlay } from '../src/ui/GameOverOverlay';
import { Hud } from '../src/ui/Hud';
import { StartOverlay } from '../src/ui/StartOverlay';

function screenXToWorld(screenX: number, width: number): number {
  const limit = CORRIDOR.halfWidth - SHIP_RADIUS - 0.2;
  const normalized = (screenX / Math.max(width, 1)) * 2 - 1;
  return Math.max(-limit, Math.min(limit, normalized * limit));
}

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const [resetToken, setResetToken] = useState(0);
  const widthRef = useRef(Dimensions.get('window').width);
  const keysRef = useRef({ left: false, right: false });
  const loadHighScore = useGameStore((s) => s.loadHighScore);
  const setSteerTarget = useGameStore((s) => s.setSteerTarget);
  const setSteerAxis = useGameStore((s) => s.setSteerAxis);
  const status = useGameStore((s) => s.status);

  useEffect(() => {
    void loadHighScore();
  }, [loadHighScore]);

  useEffect(() => {
    if (status !== 'playing') {
      keysRef.current = { left: false, right: false };
      setSteerAxis(0);
    }
  }, [setSteerAxis, status]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const syncAxis = () => {
      const { left, right } = keysRef.current;
      if (left && !right) {
        setSteerAxis(-1);
      } else if (right && !left) {
        setSteerAxis(1);
      } else {
        setSteerAxis(0);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (useGameStore.getState().status !== 'playing') {
        return;
      }
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        keysRef.current.left = true;
        syncAxis();
      }
      if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        keysRef.current.right = true;
        syncAxis();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        keysRef.current.left = false;
        syncAxis();
      }
      if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        keysRef.current.right = false;
        syncAxis();
      }
    };

    const onBlur = () => {
      keysRef.current = { left: false, right: false };
      setSteerAxis(0);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [setSteerAxis]);

  const pan = Gesture.Pan()
    .runOnJS(true)
    .enabled(status === 'playing')
    .minDistance(0)
    .onBegin((event) => {
      setSteerAxis(0);
      setSteerTarget(screenXToWorld(event.x, widthRef.current));
    })
    .onUpdate((event) => {
      setSteerTarget(screenXToWorld(event.x, widthRef.current));
    });

  const onLayout = (event: LayoutChangeEvent) => {
    widthRef.current = event.nativeEvent.layout.width;
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <GestureDetector gesture={pan}>
        <View style={styles.canvasWrap} onLayout={onLayout}>
          <RingRunnerScene resetToken={resetToken} />
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
    backgroundColor: '#040c14',
  },
  canvasWrap: {
    flex: 1,
  },
});
