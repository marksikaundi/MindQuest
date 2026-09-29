import AsyncStorage from '@react-native-async-storage/async-storage';

import { challengeForDate, todayKey } from '@/data/daily';
import { initialGameState, useGameStore } from '@/stores/gameStore';
import { initialInventoryState, useInventoryStore } from '@/stores/inventoryStore';
import { initialPlayerState, usePlayerStore } from '@/stores/playerStore';
import { initialQuestState, useQuestStore } from '@/stores/questStore';
import { defaultSettings, useSettingsStore } from '@/stores/settingsStore';
import type { Character, DailyState, GameEvent, HomeState, MiniGameProgress, Player, Settings, StatMap } from '@/types/game';

const SAVE_KEY = '@mindquest/save/v1';

export type GameSnapshot = {
  version: 1;
  savedAt: number;
  player: { player: Player; character: Character; onboarded: boolean };
  game: {
    stats: StatMap;
    visitedRegions: string[];
    forestClears: number;
    home: HomeState;
    minigames: MiniGameProgress;
    daily: DailyState;
    claimedAchievementIds: string[];
  };
  quests: { claimedIds: string[] };
  inventory: { quantities: Record<string, number> };
  settings: Settings;
};

export type SaveAdapter = {
  load: () => Promise<GameSnapshot | null>;
  save: (snapshot: GameSnapshot) => Promise<void>;
  clear: () => Promise<void>;
};

const localAdapter: SaveAdapter = {
  async load() {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameSnapshot;
  },
  async save(snapshot) {
    await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
  },
  async clear() {
    await AsyncStorage.removeItem(SAVE_KEY);
  },
};

let adapter: SaveAdapter = localAdapter;
let ready = false;
let timer: ReturnType<typeof setTimeout> | null = null;
let bound = false;

export function setSaveAdapter(next: SaveAdapter) {
  adapter = next;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback;
}

function asBoolean(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback;
}

function sanitizeStats(value: unknown): StatMap {
  if (!isRecord(value)) return {};
  const stats: StatMap = {};
  for (const [key, amount] of Object.entries(value)) {
    if (typeof amount === 'number' && Number.isFinite(amount) && amount >= 0) {
      stats[key as GameEvent] = Math.floor(amount);
    }
  }
  return stats;
}

function sanitizeSnapshot(value: unknown): GameSnapshot | null {
  if (!isRecord(value) || value.version !== 1) return null;
  const playerBlock = isRecord(value.player) ? value.player : null;
  const player = playerBlock && isRecord(playerBlock.player) ? playerBlock.player : null;
  const character = playerBlock && isRecord(playerBlock.character) ? playerBlock.character : null;
  if (!playerBlock || !player || !character) return null;

  const defaults = initialGameState();
  const game = isRecord(value.game) ? value.game : {};
  const home = isRecord(game.home) ? game.home : {};
  const slots = isRecord(home.slots) ? home.slots : defaults.home.slots;
  const minigames = isRecord(game.minigames) ? game.minigames : {};
  const memory = isRecord(minigames.memory) ? minigames.memory : {};
  const memoryClears = isRecord(memory.clears) ? memory.clears : {};
  const match = isRecord(minigames.match) ? minigames.match : {};
  const numberGame = isRecord(minigames.number) ? minigames.number : {};
  const daily = isRecord(game.daily) ? game.daily : {};
  const quests = isRecord(value.quests) ? value.quests : {};
  const inventory = isRecord(value.inventory) ? value.inventory : {};
  const settings = isRecord(value.settings) ? value.settings : {};
  const baseSettings = defaultSettings();
  const quantities = isRecord(inventory.quantities) ? inventory.quantities : {};

  const safeQuantities: Record<string, number> = {};
  for (const [key, amount] of Object.entries(quantities)) {
    if (typeof amount === 'number' && amount > 0) safeQuantities[key] = Math.floor(amount);
  }

  return {
    version: 1,
    savedAt: asNumber(value.savedAt, Date.now()),
    player: {
      onboarded: asBoolean(playerBlock.onboarded, false),
      player: {
        id: asString(player.id, ''),
        name: asString(player.name, ''),
        level: Math.max(1, asNumber(player.level, 1)),
        xp: Math.max(0, asNumber(player.xp, 0)),
        coins: Math.max(0, asNumber(player.coins, 0)),
        stars: Math.max(0, asNumber(player.stars, 0)),
      },
      character: {
        skinTone: asString(character.skinTone, 'warm'),
        hairStyle: asString(character.hairStyle, 'short'),
        hairColor: asString(character.hairColor, 'brown'),
        outfit: asString(character.outfit, 'traveler'),
        accessory: asString(character.accessory, 'none'),
      },
    },
    game: {
      stats: sanitizeStats(game.stats),
      visitedRegions: Array.isArray(game.visitedRegions)
        ? game.visitedRegions.filter((id): id is string => typeof id === 'string')
        : [],
      forestClears: asNumber(game.forestClears, 0),
      home: {
        wallpaper: asString(home.wallpaper, 'dawn'),
        slots: {
          left: typeof slots.left === 'string' ? slots.left : defaults.home.slots.left ?? null,
          center: typeof slots.center === 'string' ? slots.center : defaults.home.slots.center ?? null,
          right: typeof slots.right === 'string' ? slots.right : defaults.home.slots.right ?? null,
          trophy: typeof slots.trophy === 'string' ? slots.trophy : null,
        },
      },
      minigames: {
        memory: {
          played: asNumber(memory.played, 0),
          bestScore: asNumber(memory.bestScore, 0),
          clears: {
            easy: asNumber(memoryClears.easy, 0),
            medium: asNumber(memoryClears.medium, 0),
            hard: asNumber(memoryClears.hard, 0),
          },
        },
        match: {
          played: asNumber(match.played, 0),
          bestScore: asNumber(match.bestScore, 0),
          bestCombo: asNumber(match.bestCombo, 0),
        },
        number: {
          played: asNumber(numberGame.played, 0),
          bestScore: asNumber(numberGame.bestScore, 0),
          correct: asNumber(numberGame.correct, 0),
        },
      },
      daily: {
        date: asString(daily.date, todayKey()),
        challengeId: asString(daily.challengeId, ''),
        progress: asNumber(daily.progress, 0),
        claimed: asBoolean(daily.claimed, false),
      },
      claimedAchievementIds: Array.isArray(game.claimedAchievementIds)
        ? game.claimedAchievementIds.filter((id): id is string => typeof id === 'string')
        : [],
    },
    quests: {
      claimedIds: Array.isArray(quests.claimedIds)
        ? quests.claimedIds.filter((id): id is string => typeof id === 'string')
        : [],
    },
    inventory: { quantities: safeQuantities },
    settings: {
      music: asBoolean(settings.music, baseSettings.music),
      sound: asBoolean(settings.sound, baseSettings.sound),
      volume: Math.min(100, Math.max(0, asNumber(settings.volume, baseSettings.volume))),
      difficulty:
        settings.difficulty === 'relaxed' || settings.difficulty === 'challenge' || settings.difficulty === 'standard'
          ? settings.difficulty
          : baseSettings.difficulty,
      motion: settings.motion === 'reduced' ? 'reduced' : 'normal',
      largeText: asBoolean(settings.largeText, false),
      highContrast: asBoolean(settings.highContrast, false),
      colorFriendly: asBoolean(settings.colorFriendly, false),
      timersEnabled: asBoolean(settings.timersEnabled, false),
    },
  };
}

export function collectSnapshot(): GameSnapshot {
  const player = usePlayerStore.getState();
  const game = useGameStore.getState();
  return {
    version: 1,
    savedAt: Date.now(),
    player: { player: player.player, character: player.character, onboarded: player.onboarded },
    game: {
      stats: game.stats,
      visitedRegions: game.visitedRegions,
      forestClears: game.forestClears,
      home: game.home,
      minigames: game.minigames,
      daily: game.daily,
      claimedAchievementIds: game.claimedAchievementIds,
    },
    quests: useQuestStore.getState(),
    inventory: useInventoryStore.getState(),
    settings: useSettingsStore.getState(),
  };
}

function applyFresh() {
  usePlayerStore.setState(initialPlayerState());
  useQuestStore.setState(initialQuestState());
  useInventoryStore.setState(initialInventoryState());
  useSettingsStore.setState(defaultSettings());
  const game = initialGameState();
  const challenge = challengeForDate(todayKey());
  useGameStore.setState({
    ...game,
    daily: { date: todayKey(), challengeId: challenge.id, progress: 0, claimed: false },
    celebrations: [],
    notice: null,
  });
}

function applySnapshot(snapshot: GameSnapshot) {
  usePlayerStore.setState(snapshot.player);
  useQuestStore.setState(snapshot.quests);
  useInventoryStore.setState(snapshot.inventory);
  useSettingsStore.setState(snapshot.settings);
  useGameStore.setState({
    ...snapshot.game,
    celebrations: [],
    notice: null,
  });
}

export async function saveGameState() {
  if (!ready) return false;
  try {
    await adapter.save(collectSnapshot());
    return true;
  } catch (error) {
    console.warn('MindQuest could not save.', error);
    return false;
  }
}

function scheduleSave() {
  if (!ready) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    void saveGameState();
  }, 280);
}

export function bindAutosave() {
  if (bound) return;
  bound = true;
  usePlayerStore.subscribe(scheduleSave);
  useGameStore.subscribe(scheduleSave);
  useQuestStore.subscribe(scheduleSave);
  useInventoryStore.subscribe(scheduleSave);
  useSettingsStore.subscribe(scheduleSave);
}

export async function loadGameState() {
  ready = false;
  bindAutosave();
  let found = false;
  try {
    const raw = await adapter.load();
    const snapshot = sanitizeSnapshot(raw);
    if (!snapshot || (snapshot.player.onboarded && snapshot.player.player.name.trim().length < 2)) {
      if (!snapshot) applyFresh();
      else applySnapshot({ ...snapshot, player: { ...snapshot.player, onboarded: false } });
    } else {
      applySnapshot(snapshot);
      found = snapshot.player.onboarded;
    }
  } catch (error) {
    console.warn('MindQuest could not load a save. Starting fresh.', error);
    applyFresh();
  }
  const daily = useGameStore.getState().daily;
  const today = todayKey();
  if (daily.date !== today || !daily.challengeId) {
    const challenge = challengeForDate(today);
    useGameStore.setState({
      daily: { date: today, challengeId: challenge.id, progress: 0, claimed: false },
    });
  }
  useGameStore.setState({ hydrated: true });
  ready = true;
  return found;
}

export async function resetGameState() {
  ready = false;
  applyFresh();
  try {
    await adapter.clear();
  } catch (error) {
    console.warn('MindQuest could not clear the save.', error);
  }
  useGameStore.setState({ hydrated: true });
  ready = true;
}
