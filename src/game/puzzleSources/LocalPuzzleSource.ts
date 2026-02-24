import { PuzzleSource } from './PuzzleSource';
import { Puzzle, Difficulty } from '../types';
import { easyPuzzles } from '../puzzleBank/puzzles.easy';
import { mediumPuzzles } from '../puzzleBank/puzzles.medium';
import { hardPuzzles } from '../puzzleBank/puzzles.hard';

const allPuzzles = {
  easy: easyPuzzles,
  medium: mediumPuzzles,
  hard: hardPuzzles,
};

export class LocalPuzzleSource implements PuzzleSource {
  async getPuzzle(difficulty: Difficulty, excludeIds: string[] = []): Promise<Puzzle> {
    const pool = allPuzzles[difficulty];
    const available = pool.filter(p => !excludeIds.includes(p.id));
    const targetPool = available.length > 0 ? available : pool;
    const randomIndex = Math.floor(Math.random() * targetPool.length);
    return targetPool[randomIndex];
  }

  async getDailyPuzzle(): Promise<Puzzle> {
    const today = new Date().toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = ((hash << 5) - hash) + today.charCodeAt(i);
      hash |= 0;
    }
    const pool = allPuzzles.medium;
    const index = Math.abs(hash) % pool.length;
    return pool[index];
  }
}
