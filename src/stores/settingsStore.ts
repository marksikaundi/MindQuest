import { create } from 'zustand';

import type { Settings } from '@/types/game';

export const defaultSettings = (): Settings => ({
  music: false,
  sound: true,
  volume: 70,
  difficulty: 'standard',
  motion: 'normal',
  largeText: false,
  highContrast: false,
  colorFriendly: false,
  timersEnabled: false,
});

export const useSettingsStore = create<Settings>(() => defaultSettings());
