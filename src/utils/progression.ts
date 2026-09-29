export const XP_PER_LEVEL = 1000;

export function progressFromTotalXp(totalXp: number) {
  const safe = Math.max(0, Math.floor(totalXp));
  const level = Math.floor(safe / XP_PER_LEVEL) + 1;
  const xpIntoLevel = safe % XP_PER_LEVEL;
  return { level, xpIntoLevel, xpForLevel: XP_PER_LEVEL, totalXp: safe };
}

export function treeStage(level: number): 1 | 2 | 3 {
  if (level >= 3) return 3;
  if (level >= 2) return 2;
  return 1;
}

export function boardForDifficulty(difficulty: 'relaxed' | 'standard' | 'challenge') {
  if (difficulty === 'relaxed') return 'easy' as const;
  if (difficulty === 'challenge') return 'hard' as const;
  return 'medium' as const;
}
