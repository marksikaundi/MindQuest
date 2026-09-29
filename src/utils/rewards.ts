import type { BoardDifficulty, Reward } from '@/types/game';

export function memoryResult(
  pairs: number,
  moves: number,
  difficulty: BoardDifficulty,
  firstClear: boolean,
): Reward & { score: number } {
  const extra = Math.max(0, moves - pairs);
  const score = Math.max(40, pairs * 100 - extra * 12);
  let stars = 1;
  if (extra <= Math.ceil(pairs * 0.5)) stars = difficulty === 'hard' ? 3 : 2;
  if (!firstClear) stars = 0;
  const scale = firstClear ? 1 : 0.4;
  return {
    score,
    coins: Math.max(5, Math.round((score / 4) * scale)),
    xp: Math.max(5, Math.round((score / 5) * scale)),
    stars,
  };
}

export function matchResult(
  score: number,
  bestCombo: number,
  firstClear: boolean,
): Reward & { score: number } {
  const stars = !firstClear ? 0 : bestCombo >= 5 ? 2 : 1;
  const scale = firstClear ? 1 : 0.4;
  return {
    score,
    coins: Math.max(5, Math.round((score / 5) * scale)),
    xp: Math.max(5, Math.round((score / 6) * scale)),
    stars,
  };
}

export function numberAnswerReward(): Reward {
  return { coins: 15, xp: 20, stars: 0 };
}

export function numberRunBonus(correct: number, total: number, firstClear: boolean): Reward {
  const perfect = correct === total;
  const strong = correct >= Math.ceil(total * 0.8);
  return {
    coins: firstClear ? correct * 5 : correct * 2,
    xp: firstClear ? correct * 5 : 0,
    stars: !firstClear ? 0 : perfect ? 2 : strong ? 1 : 0,
  };
}

export const emptyReward = (): Reward => ({ coins: 0, xp: 0, stars: 0 });
