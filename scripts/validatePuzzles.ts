import { easyPuzzles } from '../src/game/puzzleBank/puzzles.easy';
import { mediumPuzzles } from '../src/game/puzzleBank/puzzles.medium';
import { hardPuzzles } from '../src/game/puzzleBank/puzzles.hard';

function differsByOneLetter(word1: string, word2: string): boolean {
  if (word1.length !== word2.length) return false;
  let diffCount = 0;
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] !== word2[i]) {
      diffCount++;
      if (diffCount > 1) return false;
    }
  }
  return diffCount === 1;
}

function getPermutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const remainingPerms = getPermutations(remaining);
    for (const perm of remainingPerms) {
      result.push([current, ...perm]);
    }
  }
  return result;
}

function validatePuzzle(puzzle: any): string | null {
  if (!puzzle.middleRungs) return 'Missing middleRungs';
  if (puzzle.middleRungs.length !== 5) return `middleRungs length is ${puzzle.middleRungs.length}, expected 5`;
  if (!puzzle.topAnswer) return 'Missing topAnswer';
  if (!puzzle.bottomAnswer) return 'Missing bottomAnswer';

  const allWords = [
    puzzle.topAnswer,
    ...puzzle.middleRungs.map((r: any) => r.answer),
    puzzle.bottomAnswer
  ];

  const uniqueWords = new Set(allWords);
  if (uniqueWords.size !== allWords.length) {
    return 'Contains duplicate words across all 7 words';
  }

  for (const word of allWords) {
    if (word.length !== puzzle.wordLength) {
      return `Word "${word}" length ${word.length} does not match puzzle wordLength ${puzzle.wordLength}`;
    }
  }

  const middleWords = puzzle.middleRungs.map((r: any) => r.answer);
  const permutations = getPermutations(middleWords);

  let hasValidChain = false;
  for (const perm of permutations) {
    let isValid = true;
    for (let i = 0; i < perm.length - 1; i++) {
      if (!differsByOneLetter(perm[i], perm[i + 1])) {
        isValid = false;
        break;
      }
    }
    if (isValid) {
      hasValidChain = true;
      break;
    }
  }

  if (!hasValidChain) {
    return 'No valid 1-letter ladder chain exists for the middle rows';
  }

  return null; // valid
}

let totalFailures = 0;

function runValidation(puzzles: any[], difficulty: string) {
  for (const puzzle of puzzles) {
    const error = validatePuzzle(puzzle);
    if (error) {
      console.log(`  ✗ [${difficulty}] ${puzzle.id} — ${error}`);
      totalFailures++;
    } else {
      console.log(`  ✓ [${difficulty}] ${puzzle.id}`);
    }
  }
}

console.log('Validating Easy Puzzles...');
runValidation(easyPuzzles, 'easy');

console.log('\nValidating Medium Puzzles...');
runValidation(mediumPuzzles, 'medium');

console.log('\nValidating Hard Puzzles...');
runValidation(hardPuzzles, 'hard');

console.log('\n--- Validation Summary ---');
if (totalFailures > 0) {
  console.error(`Total failures: ${totalFailures}`);
  process.exit(1);
} else {
  console.log('All puzzles valid.');
  process.exit(0);
}
