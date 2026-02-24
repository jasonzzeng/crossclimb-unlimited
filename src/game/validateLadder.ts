import { RowState } from './types';
import { differsByOneLetter } from './differsByOneLetter';

export function validateLadder(rows: RowState[]): boolean {
  for (let i = 1; i < rows.length; i++) {
    if (!differsByOneLetter(rows[i].currentWord, rows[i - 1].currentWord)) {
      return false;
    }
  }
  return true;
}
