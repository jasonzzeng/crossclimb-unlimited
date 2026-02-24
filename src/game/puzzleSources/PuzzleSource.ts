import { Puzzle, Difficulty } from '../types';

export interface PuzzleSource {
  getPuzzle(difficulty: Difficulty, excludeIds?: string[]): Promise<Puzzle>;
  getDailyPuzzle(): Promise<Puzzle>;
}
