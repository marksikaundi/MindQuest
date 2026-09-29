import type { RegionDefinition } from '@/types/game';

export const REGIONS: RegionDefinition[] = [
  {
    id: 'questland',
    name: 'Questland',
    description: 'A cozy village, the Great Tree, and the start of every adventure.',
    route: '/game',
    art: 'questland',
    unlock: { type: 'always' },
  },
  {
    id: 'puzzle-valley',
    name: 'Puzzle Valley',
    description: 'Bridges, towers, and calm puzzles for careful thinkers.',
    route: '/world/puzzle-valley',
    art: 'valley',
    unlock: { type: 'always' },
    visitEvent: 'visit_puzzle_valley',
    discoveryReward: { coins: 15, xp: 20, stars: 0 },
  },
  {
    id: 'adventure-forest',
    name: 'Adventure Forest',
    description: 'Look closely. Keys, leaves, and crystals hide in the green.',
    route: '/world/adventure-forest',
    art: 'forest',
    unlock: { type: 'quests', count: 1 },
    visitEvent: 'enter_adventure_forest',
    discoveryReward: { coins: 20, xp: 25, stars: 0 },
  },
  {
    id: 'creative-city',
    name: 'Creative City',
    description: 'Color, shape, and pattern come together in a bright plaza.',
    route: '/world/creative-city',
    art: 'city',
    unlock: { type: 'quests', count: 3 },
    visitEvent: 'visit_creative_city',
    discoveryReward: { coins: 25, xp: 30, stars: 0 },
  },
  {
    id: 'knowledge-island',
    name: 'Knowledge Island',
    description: 'A quiet dock and a library cottage full of curious questions.',
    route: '/world/knowledge-island',
    art: 'island',
    unlock: { type: 'quests', count: 4 },
    visitEvent: 'visit_knowledge_island',
    discoveryReward: { coins: 25, xp: 30, stars: 0 },
  },
  {
    id: 'challenge-mountain',
    name: 'Challenge Mountain',
    description: 'A steeper path for players who want a harder pattern.',
    route: '/world/challenge-mountain',
    art: 'mountain',
    unlock: { type: 'quests', count: 6 },
    visitEvent: 'visit_challenge_mountain',
    discoveryReward: { coins: 40, xp: 40, stars: 1 },
  },
];

export function unlockCopy(region: RegionDefinition) {
  if (region.unlock.type === 'always') return 'Open';
  return `Complete ${region.unlock.count} quests to unlock.`;
}

export function getRegion(id: string) {
  return REGIONS.find((region) => region.id === id);
}
