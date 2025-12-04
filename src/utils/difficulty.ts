/**
 * Difficulty level utilities
 */

import { DIFFICULTY_COLORS } from './constants';

export type DifficultyLevel = keyof typeof DIFFICULTY_COLORS;

export function getDifficultyClasses(difficulty: string): string {
  if (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard') {
    const colors = DIFFICULTY_COLORS[difficulty];
    return `${colors.bg} ${colors.text} ${colors.border}`;
  }
  return 'bg-gray-100 text-gray-700 border-gray-200';
}

export function isDifficultyValid(value: any): value is DifficultyLevel {
  return ['easy', 'medium', 'hard'].includes(value);
}

export function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return '简单';
    case 'medium':
      return '中等';
    case 'hard':
      return '困难';
    default:
      return difficulty;
  }
}
