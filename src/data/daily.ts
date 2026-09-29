import type { GameEvent, Reward } from '@/types/game';

export type DailyChallengeDefinition = {
  id: string;
  title: string;
  description: string;
  event: GameEvent;
  target: number;
  rewards: Reward;
};

export const DAILY_CHALLENGES: DailyChallengeDefinition[] = [
  {
    id: 'memory',
    title: 'Memory Minute',
    description: 'Complete one memory game.',
    event: 'complete_memory_flip',
    target: 1,
    rewards: { coins: 80, xp: 80, stars: 1 },
  },
  {
    id: 'puzzles',
    title: 'Puzzle Trio',
    description: 'Solve three puzzles.',
    event: 'complete_puzzle',
    target: 3,
    rewards: { coins: 120, xp: 100, stars: 1 },
  },
  {
    id: 'objects',
    title: 'Sharp Eyes',
    description: 'Find five hidden objects.',
    event: 'find_hidden_object',
    target: 5,
    rewards: { coins: 100, xp: 100, stars: 1 },
  },
  {
    id: 'xp',
    title: 'Growing Mind',
    description: 'Earn 500 XP.',
    event: 'earn_xp',
    target: 500,
    rewards: { coins: 150, xp: 40, stars: 1 },
  },
];

export function todayKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function challengeForDate(dateKey: string) {
  let hash = 0;
  for (let index = 0; index < dateKey.length; index += 1) {
    hash = (hash * 33 + dateKey.charCodeAt(index)) >>> 0;
  }
  return DAILY_CHALLENGES[hash % DAILY_CHALLENGES.length] ?? DAILY_CHALLENGES[0];
}

export function getDailyChallenge(id: string) {
  return DAILY_CHALLENGES.find((challenge) => challenge.id === id) ?? challengeForDate(todayKey());
}
