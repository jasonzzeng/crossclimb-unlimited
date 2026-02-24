import { PuzzleSource } from './PuzzleSource';
import { Puzzle, Difficulty } from '../types';

export class AiPuzzleSource implements PuzzleSource {
  async getPuzzle(difficulty: Difficulty, excludeIds?: string[]): Promise<Puzzle> {
    throw new Error('AI Puzzle Generation not yet implemented.');
  }
  async getDailyPuzzle(): Promise<Puzzle> {
    throw new Error('AI Puzzle Generation not yet implemented.');
  }
}
