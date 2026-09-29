import { create } from 'zustand';

import { defaultCharacter } from '@/data/characters';
import type { Character, Player } from '@/types/game';

export const initialPlayer = (): Player => ({
  id: '',
  name: '',
  level: 1,
  xp: 0,
  coins: 0,
  stars: 0,
});

export const initialCharacter = (): Character => ({ ...defaultCharacter });

type PlayerState = {
  player: Player;
  character: Character;
  onboarded: boolean;
};

export const initialPlayerState = (): PlayerState => ({
  player: initialPlayer(),
  character: initialCharacter(),
  onboarded: false,
});

export const usePlayerStore = create<PlayerState>(() => initialPlayerState());
