import { create } from 'zustand';

import { todayKey } from '@/data/daily';
import type { Celebration, DailyState, HomeState, MiniGameProgress, StatMap } from '@/types/game';

export const initialHome = (): HomeState => ({
  wallpaper: 'dawn',
  slots: { left: 'plant', center: 'rug-cozy', right: 'lamp', trophy: null },
});

export const initialMiniGames = (): MiniGameProgress => ({
  memory: { played: 0, bestScore: 0, clears: { easy: 0, medium: 0, hard: 0 } },
  match: { played: 0, bestScore: 0, bestCombo: 0 },
  number: { played: 0, bestScore: 0, correct: 0 },
});

export const initialDaily = (): DailyState => ({
  date: todayKey(),
  challengeId: '',
  progress: 0,
  claimed: false,
});

type GameState = {
  hydrated: boolean;
  stats: StatMap;
  visitedRegions: string[];
  forestClears: number;
  home: HomeState;
  minigames: MiniGameProgress;
  daily: DailyState;
  claimedAchievementIds: string[];
  celebrations: Celebration[];
  notice: string | null;
};

export const initialGameState = (): Omit<GameState, 'hydrated' | 'notice'> => ({
  stats: {},
  visitedRegions: [],
  forestClears: 0,
  home: initialHome(),
  minigames: initialMiniGames(),
  daily: initialDaily(),
  claimedAchievementIds: [],
  celebrations: [],
});

type GameActions = {
  pushCelebration: (celebration: Celebration) => void;
  dismissCelebration: () => void;
  setNotice: (notice: string | null) => void;
};

export const useGameStore = create<GameState & GameActions>((set) => ({
  hydrated: false,
  notice: null,
  ...initialGameState(),
  pushCelebration: (celebration) =>
    set((state) => ({ celebrations: [...state.celebrations, celebration] })),
  dismissCelebration: () => set((state) => ({ celebrations: state.celebrations.slice(1) })),
  setNotice: (notice) => set({ notice }),
}));
