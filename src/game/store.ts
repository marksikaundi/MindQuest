import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import type { GameStatus } from './types';

const HIGH_SCORE_KEY = 'ring-runner:high-score';

interface GameState {
  status: GameStatus;
  score: number;
  highScore: number;
  /** Absolute lateral target in world units (from touch / hold) */
  steerTarget: number;
  /** Keyboard / hold axis: -1 left, 0 none, 1 right */
  steerAxis: number;
  /** Brief pulse when a ring is scored (ms timestamp) */
  scorePulseAt: number;
  startGame: () => void;
  endGame: () => void;
  addScore: (points?: number) => void;
  setSteerTarget: (x: number) => void;
  setSteerAxis: (axis: number) => void;
  loadHighScore: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  status: 'start',
  score: 0,
  highScore: 0,
  steerTarget: 0,
  steerAxis: 0,
  scorePulseAt: 0,

  startGame: () => {
    set({
      status: 'playing',
      score: 0,
      steerTarget: 0,
      steerAxis: 0,
      scorePulseAt: 0,
    });
  },

  endGame: () => {
    const { score, highScore } = get();
    const nextHigh = Math.max(score, highScore);
    set({ status: 'gameover', highScore: nextHigh, steerAxis: 0 });
    void AsyncStorage.setItem(HIGH_SCORE_KEY, String(nextHigh));
  },

  addScore: (points = 1) => {
    set((state) => ({
      score: state.score + points,
      scorePulseAt: performance.now(),
    }));
  },

  setSteerTarget: (x: number) => {
    set({ steerTarget: x });
  },

  setSteerAxis: (axis: number) => {
    const clamped = Math.max(-1, Math.min(1, axis));
    set({ steerAxis: clamped });
  },

  loadHighScore: async () => {
    try {
      const raw = await AsyncStorage.getItem(HIGH_SCORE_KEY);
      const value = raw ? Number.parseInt(raw, 10) : 0;
      if (!Number.isNaN(value)) {
        set({ highScore: value });
      }
    } catch {
      // Offline-only; ignore storage failures
    }
  },
}));
