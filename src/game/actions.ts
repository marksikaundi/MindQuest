import { ACHIEVEMENTS } from '@/data/achievements';
import { defaultCharacter } from '@/data/characters';
import { getDailyChallenge, todayKey, challengeForDate } from '@/data/daily';
import { ITEMS, getItem } from '@/data/items';
import { QUESTS } from '@/data/quests';
import { REGIONS, getRegion } from '@/data/regions';
import { initialHome, useGameStore } from '@/stores/gameStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useQuestStore } from '@/stores/questStore';
import type { AchievementContext, BoardDifficulty, Celebration, Character, GameEvent, Reward } from '@/types/game';
import { createId } from '@/utils/id';
import { progressFromTotalXp } from '@/utils/progression';

let deferring = false;
let deferred: Celebration[] = [];
let syncing = false;
let pendingSync = false;

export function setDeferCelebrations(on: boolean) {
  deferring = on;
  if (!on) {
    const queued = deferred;
    deferred = [];
    if (queued.length > 0) {
      useGameStore.setState((state) => ({ celebrations: [...state.celebrations, ...queued] }));
    }
  }
}

function pushCelebration(celebration: Celebration) {
  if (deferring) {
    deferred.push(celebration);
    return;
  }
  useGameStore.getState().pushCelebration(celebration);
}

export function ownsItem(id: string) {
  return (useInventoryStore.getState().quantities[id] ?? 0) > 0;
}

export function addItem(id: string, amount = 1) {
  if (amount <= 0) return;
  useInventoryStore.setState((state) => ({
    quantities: { ...state.quantities, [id]: (state.quantities[id] ?? 0) + amount },
  }));
}

function questsCompleted() {
  return useQuestStore.getState().claimedIds.length;
}

export function isRegionUnlocked(regionId: string) {
  const region = getRegion(regionId);
  if (!region) return false;
  if (region.unlock.type === 'always') return true;
  return questsCompleted() >= region.unlock.count;
}

function achievementContext(): AchievementContext {
  return {
    stats: useGameStore.getState().stats,
    questsCompleted: questsCompleted(),
    visitedRegions: useGameStore.getState().visitedRegions,
    unlockedRegionIds: REGIONS.filter((region) => isRegionUnlocked(region.id)).map((region) => region.id),
  };
}

function bumpDaily(event: GameEvent, amount: number) {
  const today = todayKey();
  let daily = useGameStore.getState().daily;
  if (daily.date !== today) {
    const challenge = challengeForDate(today);
    daily = { date: today, challengeId: challenge.id, progress: 0, claimed: false };
  }
  const definition = getDailyChallenge(daily.challengeId);
  if (definition.event !== event || daily.claimed) {
    if (daily !== useGameStore.getState().daily) useGameStore.setState({ daily });
    return;
  }
  useGameStore.setState({ daily: { ...daily, progress: daily.progress + amount } });
}

export function grantReward(reward: Reward, source: string) {
  if (reward.coins === 0 && reward.xp === 0 && reward.stars === 0) return;
  const current = usePlayerStore.getState().player;
  const totalXp = current.xp + Math.max(0, reward.xp);
  const progress = progressFromTotalXp(totalXp);
  usePlayerStore.setState({
    player: {
      ...current,
      xp: totalXp,
      level: progress.level,
      coins: current.coins + Math.max(0, reward.coins),
      stars: current.stars + Math.max(0, reward.stars),
    },
  });
  if (progress.level > current.level) {
    for (let level = current.level + 1; level <= progress.level; level += 1) {
      pushCelebration({ id: createId(), kind: 'level-up', level });
    }
  }
  if (reward.xp > 0 && source !== 'daily') bumpDaily('earn_xp', reward.xp);
  syncProgress();
}

function syncQuests() {
  const stats = useGameStore.getState().stats;
  const claimed = new Set(useQuestStore.getState().claimedIds);
  const fresh: string[] = [];
  for (const quest of QUESTS) {
    if (claimed.has(quest.id)) continue;
    const done = quest.objectives.every((objective) => (stats[objective.event] ?? 0) >= objective.target);
    if (done) fresh.push(quest.id);
  }
  if (fresh.length === 0) return;
  useQuestStore.setState({ claimedIds: [...claimed, ...fresh] });
  addItem('quest-medal', fresh.length);
  for (const id of fresh) {
    const quest = QUESTS.find((item) => item.id === id);
    if (!quest) continue;
    grantReward(quest.rewards, 'quest');
    pushCelebration({ id: createId(), kind: 'quest', title: quest.title, rewards: quest.rewards });
  }
}

function syncAchievements() {
  const claimed = new Set(useGameStore.getState().claimedAchievementIds);
  const context = achievementContext();
  const fresh = ACHIEVEMENTS.filter((achievement) => {
    if (claimed.has(achievement.id)) return false;
    const progress = achievement.progress(context);
    return progress.target > 0 && progress.current >= progress.target;
  });
  if (fresh.length === 0) return;
  useGameStore.setState({
    claimedAchievementIds: [...claimed, ...fresh.map((achievement) => achievement.id)],
  });
  for (const achievement of fresh) {
    grantReward(achievement.reward, 'achievement');
    pushCelebration({
      id: createId(),
      kind: 'achievement',
      title: achievement.title,
      description: achievement.description,
    });
  }
}

function syncDaily() {
  const daily = useGameStore.getState().daily;
  if (daily.claimed) return;
  const definition = getDailyChallenge(daily.challengeId);
  if (daily.progress < definition.target) return;
  useGameStore.setState({ daily: { ...daily, claimed: true } });
  grantReward(definition.rewards, 'daily');
  pushCelebration({ id: createId(), kind: 'daily', title: definition.title, rewards: definition.rewards });
}

function syncProgress() {
  if (syncing) {
    pendingSync = true;
    return;
  }
  syncing = true;
  let guard = 0;
  try {
    do {
      pendingSync = false;
      syncQuests();
      syncAchievements();
      syncDaily();
      guard += 1;
    } while (pendingSync && guard < 6);
  } finally {
    syncing = false;
  }
}

export function track(event: GameEvent, amount = 1) {
  if (amount <= 0) return;
  const stats = useGameStore.getState().stats;
  useGameStore.setState({ stats: { ...stats, [event]: (stats[event] ?? 0) + amount } });
  bumpDaily(event, amount);
  syncProgress();
}

export function exploreVillage() {
  const before = useGameStore.getState().stats.explore_village ?? 0;
  track('explore_village', 1);
  if (before === 0) grantReward({ coins: 10, xp: 15, stars: 0 }, 'discover');
}

export function visitTree() {
  const before = useGameStore.getState().stats.visit_great_tree ?? 0;
  track('visit_great_tree', 1);
  if (before === 0) grantReward({ coins: 10, xp: 15, stars: 0 }, 'discover');
}

export function openWorldMap() {
  const before = useGameStore.getState().stats.open_world_map ?? 0;
  track('open_world_map', 1);
  if (before === 0) grantReward({ coins: 10, xp: 10, stars: 0 }, 'discover');
}

const forestItems: Record<string, string> = {
  key: 'key',
  leaf: 'leaf',
  star: 'star-charm',
  mushroom: 'mushroom',
  crystal: 'crystal',
};

export function findHiddenObject(id: string) {
  const itemId = forestItems[id];
  if (itemId) addItem(itemId, 1);
  track('find_hidden_object', 1);
  grantReward({ coins: 8, xp: 10, stars: 0 }, 'find');
}

export function grantOnce(flagId: string, reward: Reward, source: string) {
  if (ownsItem(flagId)) {
    grantReward(
      {
        coins: Math.round(reward.coins * 0.4),
        xp: Math.round(reward.xp * 0.4),
        stars: 0,
      },
      source,
    );
    return false;
  }
  addItem(flagId, 1);
  grantReward(reward, source);
  return true;
}

export function visitRegion(regionId: string) {
  const region = getRegion(regionId);
  if (!region || !isRegionUnlocked(regionId)) return;
  const visited = useGameStore.getState().visitedRegions;
  if (!visited.includes(regionId)) {
    useGameStore.setState({ visitedRegions: [...visited, regionId] });
  }
  if (!region.visitEvent) {
    syncProgress();
    return;
  }
  const before = useGameStore.getState().stats[region.visitEvent] ?? 0;
  track(region.visitEvent, 1);
  if (before === 0 && region.discoveryReward) grantReward(region.discoveryReward, 'discover');
}

export function startAdventure() {
  createAdventure('Explorer', { ...defaultCharacter });
}

export function createAdventure(name: string, character: Character) {
  const quantities: Record<string, number> = {};
  for (const item of ITEMS) {
    if (item.starter) quantities[item.id] = 1;
  }
  quantities[character.outfit] = 1;
  quantities[character.accessory] = 1;
  useInventoryStore.setState({ quantities });
  usePlayerStore.setState({
    onboarded: true,
    character,
    player: { id: createId(), name: name.trim(), level: 1, xp: 0, coins: 0, stars: 0 },
  });
  useGameStore.setState({ home: initialHome(), visitedRegions: [], stats: {} });
}

export function saveCharacter(character: Character) {
  if (!ownsItem(character.outfit) || !ownsItem(character.accessory)) {
    return 'Own that item before saving it.';
  }
  usePlayerStore.setState({ character });
  return 'Look saved.';
}

export function purchaseItem(itemId: string) {
  const item = getItem(itemId);
  if (!item || item.shop === false) return 'That item is not for sale.';
  if (item.unique && ownsItem(itemId)) return 'You already own this.';
  const coins = usePlayerStore.getState().player.coins;
  if (coins < item.price) return 'Not enough coins yet.';
  usePlayerStore.setState((state) => ({
    player: { ...state.player, coins: state.player.coins - item.price },
  }));
  addItem(itemId, 1);
  return `Purchased ${item.name}.`;
}

export function setWallpaper(wallpaperId: string) {
  if (!ownsItem(wallpaperId)) return 'Unlock this wallpaper first.';
  useGameStore.setState((state) => ({ home: { ...state.home, wallpaper: wallpaperId } }));
  return 'Wallpaper updated.';
}

export function placeDecoration(slotId: string, itemId: string | null) {
  if (itemId && !ownsItem(itemId)) return 'You do not own that decoration.';
  const before = useGameStore.getState().stats.place_decoration ?? 0;
  useGameStore.setState((state) => ({
    home: { ...state.home, slots: { ...state.home.slots, [slotId]: itemId } },
  }));
  if (itemId && before === 0) track('place_decoration', 1);
  return itemId ? 'Decoration placed.' : 'Spot cleared.';
}

export function recordMemoryClear(difficulty: BoardDifficulty, score: number) {
  const memory = useGameStore.getState().minigames.memory;
  const first = memory.clears[difficulty] === 0;
  useGameStore.setState((state) => ({
    minigames: {
      ...state.minigames,
      memory: {
        played: memory.played + 1,
        bestScore: Math.max(memory.bestScore, score),
        clears: { ...memory.clears, [difficulty]: memory.clears[difficulty] + 1 },
      },
    },
  }));
  return first;
}

export function recordMatchClear(score: number, combo: number) {
  const match = useGameStore.getState().minigames.match;
  const first = match.played === 0;
  useGameStore.setState((state) => ({
    minigames: {
      ...state.minigames,
      match: {
        played: match.played + 1,
        bestScore: Math.max(match.bestScore, score),
        bestCombo: Math.max(match.bestCombo, combo),
      },
    },
  }));
  return first;
}

export function recordNumberClear(score: number) {
  const numberGame = useGameStore.getState().minigames.number;
  const first = numberGame.played === 0;
  useGameStore.setState((state) => ({
    minigames: {
      ...state.minigames,
      number: { ...numberGame, played: numberGame.played + 1, bestScore: Math.max(numberGame.bestScore, score) },
    },
  }));
  return first;
}

export function noteNumberCorrect() {
  useGameStore.setState((state) => ({
    minigames: {
      ...state.minigames,
      number: { ...state.minigames.number, correct: state.minigames.number.correct + 1 },
    },
  }));
}

export function finishForestSearch() {
  const first = useGameStore.getState().forestClears === 0;
  useGameStore.setState((state) => ({ forestClears: state.forestClears + 1 }));
  grantReward(first ? { coins: 80, xp: 90, stars: 1 } : { coins: 30, xp: 30, stars: 0 }, 'forest');
  return first;
}

export { achievementContext };
