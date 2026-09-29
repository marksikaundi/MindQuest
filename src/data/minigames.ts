export type MiniGameDefinition = {
  id: string;
  title: string;
  blurb: string;
  howTo: string;
  route: '/minigames/memory-flip' | '/minigames/match-master' | '/minigames/number-quest';
  accent: string;
};

export const MINIGAMES: MiniGameDefinition[] = [
  {
    id: 'memory-flip',
    title: 'Memory Flip',
    blurb: 'Turn cards and remember every pair.',
    howTo: 'Tap two cards. Matches stay open. A miss flips back.',
    route: '/minigames/memory-flip',
    accent: '#6C63FF',
  },
  {
    id: 'match-master',
    title: 'Match Master',
    blurb: 'Match the shape, color, and pattern.',
    howTo: 'Look at the target, then tap the tile that matches. Combos grow when you are right in a row.',
    route: '/minigames/match-master',
    accent: '#45C4B0',
  },
  {
    id: 'number-quest',
    title: 'Number Quest',
    blurb: 'Spot the pattern and choose the next number.',
    howTo: 'Read the sequence, pick an answer, and keep going even if you miss.',
    route: '/minigames/number-quest',
    accent: '#E8A317',
  },
];

export const MEMORY_SYMBOLS = [
  'sun',
  'moon',
  'star',
  'leaf',
  'key',
  'mushroom',
  'crystal',
  'heart',
  'tree',
  'flower',
  'book',
  'gem',
] as const;

export type MemorySymbol = (typeof MEMORY_SYMBOLS)[number];

export const MATCH_SHAPES = ['circle', 'square', 'triangle', 'diamond', 'hex', 'star'] as const;
export const MATCH_COLORS = [
  { id: 'coral', label: 'Coral', hex: '#E85D75' },
  { id: 'teal', label: 'Teal', hex: '#1AA58A' },
  { id: 'gold', label: 'Gold', hex: '#E8A317' },
  { id: 'violet', label: 'Violet', hex: '#6C63FF' },
  { id: 'blue', label: 'Blue', hex: '#3D7EA6' },
  { id: 'green', label: 'Green', hex: '#2F9E6B' },
] as const;
export const MATCH_PATTERNS = ['solid', 'stripes', 'dots'] as const;

export type MatchShape = (typeof MATCH_SHAPES)[number];
export type MatchColor = (typeof MATCH_COLORS)[number]['id'];
export type MatchPattern = (typeof MATCH_PATTERNS)[number];

export type MatchTile = {
  shape: MatchShape;
  color: MatchColor;
  pattern: MatchPattern;
};
