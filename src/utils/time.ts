/**
 * Time and duration calculation utilities
 */

export function calculateTotalTime(prepTime?: number, cookTime?: number): number {
  return (prepTime || 0) + (cookTime || 0);
}

export function formatTimeDisplay(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getEstimatedDifficulty(prepTime?: number, cookTime?: number): 'easy' | 'medium' | 'hard' | null {
  const total = calculateTotalTime(prepTime, cookTime);
  if (total === 0) return null;
  if (total <= 30) return 'easy';
  if (total <= 90) return 'medium';
  return 'hard';
}
