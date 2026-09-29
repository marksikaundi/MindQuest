import type { BoardDifficulty } from '@/types/game';

export type NumberPuzzle = {
  id: string;
  difficulty: BoardDifficulty;
  shown: number[];
  answer: number;
  options: number[];
  explanation: string;
};

export const NUMBER_PUZZLES: NumberPuzzle[] = [
  { id: 'e1', difficulty: 'easy', shown: [2, 4, 6], answer: 8, options: [7, 8, 9, 10], explanation: 'Each number grows by 2.' },
  { id: 'e2', difficulty: 'easy', shown: [5, 10, 15], answer: 20, options: [18, 20, 25, 30], explanation: 'Each number grows by 5.' },
  { id: 'e3', difficulty: 'easy', shown: [3, 6, 9], answer: 12, options: [10, 11, 12, 15], explanation: 'Count by threes.' },
  { id: 'e4', difficulty: 'easy', shown: [1, 2, 4], answer: 8, options: [6, 7, 8, 10], explanation: 'Each number doubles.' },
  { id: 'e5', difficulty: 'easy', shown: [10, 20, 30], answer: 40, options: [35, 40, 50, 60], explanation: 'Each number grows by 10.' },
  { id: 'e6', difficulty: 'easy', shown: [4, 8, 12], answer: 16, options: [14, 15, 16, 20], explanation: 'Count by fours.' },
  { id: 'e7', difficulty: 'easy', shown: [9, 8, 7], answer: 6, options: [5, 6, 4, 9], explanation: 'Each number goes down by 1.' },
  { id: 'e8', difficulty: 'easy', shown: [1, 3, 5], answer: 7, options: [6, 7, 8, 9], explanation: 'These are odd numbers in a row.' },
  { id: 'm1', difficulty: 'medium', shown: [2, 3, 5, 8], answer: 12, options: [10, 11, 12, 13], explanation: 'Add the previous two steps: +1, +2, +3, so next is +4.' },
  { id: 'm2', difficulty: 'medium', shown: [1, 4, 9, 16], answer: 25, options: [20, 24, 25, 36], explanation: 'These are square numbers: 1, 2, 3, 4, then 5 squared.' },
  { id: 'm3', difficulty: 'medium', shown: [3, 6, 12, 24], answer: 48, options: [30, 36, 42, 48], explanation: 'Each number doubles.' },
  { id: 'm4', difficulty: 'medium', shown: [2, 5, 11, 23], answer: 47, options: [41, 46, 47, 50], explanation: 'Double the number, then add 1.' },
  { id: 'm5', difficulty: 'medium', shown: [4, 6, 9, 13], answer: 18, options: [16, 17, 18, 20], explanation: 'The gaps grow: +2, +3, +4, then +5.' },
  { id: 'm6', difficulty: 'medium', shown: [20, 17, 14, 11], answer: 8, options: [7, 8, 9, 10], explanation: 'Each number drops by 3.' },
  { id: 'm7', difficulty: 'medium', shown: [1, 2, 4, 7], answer: 11, options: [9, 10, 11, 14], explanation: 'The gaps grow: +1, +2, +3, then +4.' },
  { id: 'm8', difficulty: 'medium', shown: [5, 6, 8, 11], answer: 15, options: [13, 14, 15, 16], explanation: 'The gaps grow by one each time.' },
  { id: 'h1', difficulty: 'hard', shown: [1, 1, 2, 3, 5], answer: 8, options: [6, 7, 8, 9], explanation: 'Each number is the sum of the two before it.' },
  { id: 'h2', difficulty: 'hard', shown: [2, 3, 5, 7, 11], answer: 13, options: [12, 13, 14, 15], explanation: 'These are prime numbers in order.' },
  { id: 'h3', difficulty: 'hard', shown: [3, 5, 9, 17], answer: 33, options: [25, 31, 33, 35], explanation: 'Double the number, then subtract 1.' },
  { id: 'h4', difficulty: 'hard', shown: [1, 4, 3, 6, 5], answer: 8, options: [6, 7, 8, 9], explanation: 'The pattern alternates: +3, then -1.' },
  { id: 'h5', difficulty: 'hard', shown: [2, 6, 3, 9, 6], answer: 18, options: [9, 12, 15, 18], explanation: 'Multiply by 3, then subtract 3, and repeat.' },
  { id: 'h6', difficulty: 'hard', shown: [81, 27, 9, 3], answer: 1, options: [0, 1, 2, 6], explanation: 'Each number is divided by 3.' },
  { id: 'h7', difficulty: 'hard', shown: [4, 9, 19, 39], answer: 79, options: [59, 69, 79, 89], explanation: 'Double the number, then add 1.' },
  { id: 'h8', difficulty: 'hard', shown: [1, 3, 7, 15], answer: 31, options: [23, 27, 30, 31], explanation: 'Double the number, then add 1.' },
];

export type LogicQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export const BRIDGE_QUESTIONS: LogicQuestion[] = [
  {
    id: 'b1',
    prompt: 'A bridge allows 2 travelers at a time. 6 friends need to cross. What is the fewest number of crossings if someone must bring the lantern back each time, except the last crossing?',
    options: ['3', '5', '9', '6'],
    answer: 1,
    explanation: 'Three pairs go over, and the lantern comes back twice. That is 5 crossings.',
  },
  {
    id: 'b2',
    prompt: 'Which shape does not belong: circle, square, triangle, apple?',
    options: ['Circle', 'Square', 'Triangle', 'Apple'],
    answer: 3,
    explanation: 'Apple is a thing you can hold. The others are shapes.',
  },
  {
    id: 'b3',
    prompt: 'If all puzzle towers are tall, and this tower is a puzzle tower, what must be true?',
    options: ['It is short', 'It is tall', 'It is a bridge', 'It is locked'],
    answer: 1,
    explanation: 'If every puzzle tower is tall, this one is tall too.',
  },
];

export const KNOWLEDGE_QUESTIONS: LogicQuestion[] = [
  {
    id: 'k1',
    prompt: 'Which of these is a tool for remembering a path?',
    options: ['A map', 'A shadow', 'A puddle', 'An echo'],
    answer: 0,
    explanation: 'A map records the way so you can follow it again.',
  },
  {
    id: 'k2',
    prompt: 'What comes next in a calm study habit: notice, try, check, ___?',
    options: ['Rush', 'Hide', 'Try again', 'Skip'],
    answer: 2,
    explanation: 'After you check an answer, you try again with what you learned.',
  },
  {
    id: 'k3',
    prompt: 'A sequence grows by the same amount each time. What kind of pattern is that?',
    options: ['Random', 'Adding pattern', 'A color', 'A secret'],
    answer: 1,
    explanation: 'When the gap stays the same, you are adding the same number.',
  },
];

export function puzzlesFor(difficulty: BoardDifficulty) {
  return NUMBER_PUZZLES.filter((puzzle) => puzzle.difficulty === difficulty);
}

export function shuffle<T>(list: T[]): T[] {
  const next = [...list];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const current = next[index];
    const other = next[swap];
    if (current === undefined || other === undefined) continue;
    next[index] = other;
    next[swap] = current;
  }
  return next;
}
