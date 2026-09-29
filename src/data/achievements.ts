import type { AchievementDefinition } from '@/types/game';

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first quest.',
    icon: 'walk',
    reward: { coins: 25, xp: 0, stars: 1 },
    progress: (ctx) => ({ current: Math.min(1, ctx.questsCompleted), target: 1 }),
  },
  {
    id: 'puzzle-explorer',
    title: 'Puzzle Explorer',
    description: 'Complete 5 puzzles.',
    icon: 'puzzle',
    reward: { coins: 40, xp: 0, stars: 1 },
    progress: (ctx) => ({ current: Math.min(5, ctx.stats.complete_puzzle ?? 0), target: 5 }),
  },
  {
    id: 'memory-master',
    title: 'Memory Master',
    description: 'Complete Memory Flip.',
    icon: 'cards',
    reward: { coins: 25, xp: 0, stars: 1 },
    progress: (ctx) => ({ current: Math.min(1, ctx.stats.complete_memory_flip ?? 0), target: 1 }),
  },
  {
    id: 'treasure-hunter',
    title: 'Treasure Hunter',
    description: 'Find 10 hidden objects.',
    icon: 'gem',
    reward: { coins: 50, xp: 0, stars: 1 },
    progress: (ctx) => ({ current: Math.min(10, ctx.stats.find_hidden_object ?? 0), target: 10 }),
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Visit every unlocked region.',
    icon: 'map',
    reward: { coins: 60, xp: 0, stars: 1 },
    progress: (ctx) => {
      const target = Math.max(1, ctx.unlockedRegionIds.length);
      const current = ctx.unlockedRegionIds.filter((id) => ctx.visitedRegions.includes(id)).length;
      return { current: Math.min(target, current), target };
    },
  },
];
