import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import type { GameStatus } from './types';

const HIGH_SCORE_KEY = 'ring-runner:high-score';

interface GameState {
  status: GameStatus;
  score: number;
  highScore: number;
  /** Target lateral position from input, clamped later by ship */
  steerTarget: number;
  startGame: () => void;
  endGame: () => void;
  addScore: (points?: number) => void;
  setSteerTarget: (x: number) => void;
  loadHighScore: () => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  status: 'start',
  score: 0,
  highScore: 0,
  steerTarget: 0,

  startGame: () => {
    set({ status: 'playing', score: 0, steerTarget: 0 });
  },

  endGame: () => {
    const { score, highScore } = get();
    const nextHigh = Math.max(score, highScore);
    set({ status: 'gameover', highScore: nextHigh });
    void AsyncStorage.setItem(HIGH_SCORE_KEY, String(nextHigh));
  },

  addScore: (points = 1) => {
    set((state) => ({ score: state.score + points }));
  },

  setSteerTarget: (x: number) => {
    set({ steerTarget: x });
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
