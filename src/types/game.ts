export type Reward = {
  coins: number;
  xp: number;
  stars: number;
};

export type GameEvent =
  | 'explore_village'
  | 'visit_great_tree'
  | 'open_world_map'
  | 'visit_puzzle_valley'
  | 'complete_puzzle'
  | 'enter_adventure_forest'
  | 'find_hidden_object'
  | 'complete_memory_flip'
  | 'match_all_pairs'
  | 'complete_match_master'
  | 'complete_number_quest'
  | 'place_decoration'
  | 'earn_xp'
  | 'visit_creative_city'
  | 'visit_knowledge_island'
  | 'visit_challenge_mountain';

export type QuestObjective = {
  id: string;
  description: string;
  event: GameEvent;
  target: number;
};

export type QuestDefinition = {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  rewards: Reward;
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  rewards: Reward;
  completed: boolean;
  objectives: (QuestObjective & { current: number })[];
};

export type Player = {
  id: string;
  name: string;
  level: number;
  xp: number;
  coins: number;
  stars: number;
};

export type Character = {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfit: string;
  accessory: string;
};

export type Difficulty = 'relaxed' | 'standard' | 'challenge';
export type BoardDifficulty = 'easy' | 'medium' | 'hard';

export type Settings = {
  music: boolean;
  sound: boolean;
  volume: number;
  difficulty: Difficulty;
  motion: 'normal' | 'reduced';
  largeText: boolean;
  highContrast: boolean;
  colorFriendly: boolean;
  timersEnabled: boolean;
};

export type ItemCategory = 'character' | 'accessory' | 'home' | 'collectible' | 'special';

export type ItemDefinition = {
  id: string;
  name: string;
  category: ItemCategory;
  description: string;
  price: number;
  starter?: boolean;
  unique?: boolean;
  shop?: boolean;
  icon: 'shirt' | 'sparkles' | 'home' | 'leaf' | 'star' | 'key' | 'gem' | 'medal';
};

export type UnlockRule = { type: 'always' } | { type: 'quests'; count: number };

export type RegionDefinition = {
  id: string;
  name: string;
  description: string;
  route: string;
  art: 'questland' | 'valley' | 'forest' | 'city' | 'island' | 'mountain';
  unlock: UnlockRule;
  visitEvent?: GameEvent;
  discoveryReward?: Reward;
};

export type Celebration =
  | { id: string; kind: 'level-up'; level: number }
  | { id: string; kind: 'quest'; title: string; rewards: Reward }
  | { id: string; kind: 'achievement'; title: string; description: string }
  | { id: string; kind: 'daily'; title: string; rewards: Reward };

export type HomeState = {
  wallpaper: string;
  slots: Record<string, string | null>;
};

export type MiniGameProgress = {
  memory: {
    played: number;
    bestScore: number;
    clears: Record<BoardDifficulty, number>;
  };
  match: { played: number; bestScore: number; bestCombo: number };
  number: { played: number; bestScore: number; correct: number };
};

export type DailyState = {
  date: string;
  challengeId: string;
  progress: number;
  claimed: boolean;
};

export type StatMap = Partial<Record<GameEvent, number>>;

export type AchievementContext = {
  stats: StatMap;
  questsCompleted: number;
  visitedRegions: string[];
  unlockedRegionIds: string[];
};

export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  icon: 'walk' | 'puzzle' | 'cards' | 'gem' | 'map';
  reward: Reward;
  progress: (context: AchievementContext) => { current: number; target: number };
};
