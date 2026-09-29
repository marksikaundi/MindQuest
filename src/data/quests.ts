import type { QuestDefinition } from '@/types/game';

export const QUESTS: QuestDefinition[] = [
  {
    id: 'welcome',
    title: 'Welcome to Questland',
    description: 'Take a first look around your new home.',
    objectives: [
      { id: 'village', description: 'Explore the village', event: 'explore_village', target: 1 },
      { id: 'tree', description: 'Visit the Great Tree', event: 'visit_great_tree', target: 1 },
      { id: 'map', description: 'Open the world map', event: 'open_world_map', target: 1 },
    ],
    rewards: { coins: 100, xp: 100, stars: 1 },
  },
  {
    id: 'puzzle-explorer',
    title: 'Puzzle Explorer',
    description: 'Puzzle Valley is open. Solve something clever.',
    objectives: [
      { id: 'visit', description: 'Visit Puzzle Valley', event: 'visit_puzzle_valley', target: 1 },
      { id: 'solve', description: 'Complete one puzzle', event: 'complete_puzzle', target: 1 },
    ],
    rewards: { coins: 150, xp: 150, stars: 1 },
  },
  {
    id: 'forest-adventurer',
    title: 'Forest Adventurer',
    description: 'The trees are hiding a few bright things.',
    objectives: [
      { id: 'enter', description: 'Enter Adventure Forest', event: 'enter_adventure_forest', target: 1 },
      { id: 'find', description: 'Find three hidden objects', event: 'find_hidden_object', target: 3 },
    ],
    rewards: { coins: 200, xp: 200, stars: 1 },
  },
  {
    id: 'memory-master',
    title: 'Memory Master',
    description: 'Clear a Memory Flip board from start to finish.',
    objectives: [
      { id: 'play', description: 'Complete Memory Flip', event: 'complete_memory_flip', target: 1 },
      { id: 'pairs', description: 'Match all pairs', event: 'match_all_pairs', target: 1 },
    ],
    rewards: { coins: 100, xp: 100, stars: 1 },
  },
  {
    id: 'match-maker',
    title: 'Match Maker',
    description: 'Finish a round of Match Master.',
    objectives: [
      { id: 'match', description: 'Complete Match Master', event: 'complete_match_master', target: 1 },
    ],
    rewards: { coins: 120, xp: 120, stars: 1 },
  },
  {
    id: 'number-sage',
    title: 'Number Sage',
    description: 'Finish a Number Quest run.',
    objectives: [
      { id: 'numbers', description: 'Complete Number Quest', event: 'complete_number_quest', target: 1 },
    ],
    rewards: { coins: 120, xp: 120, stars: 1 },
  },
];
