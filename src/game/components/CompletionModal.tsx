import { formatTime } from '../../utils/time';
import { useEffect, useState } from 'react';

export function CompletionModal({ gameState, puzzle, onNewPuzzle, onChangeDifficulty }: any) {
  const { elapsedTime, penalties, hintsUsed, revealsUsed } = gameState;
  const totalTime = elapsedTime + penalties;
  const [bestTime, setBestTime] = useState<number | null>(null);

  useEffect(() => {
    const key = `bestTime_${puzzle.difficulty}`;
    const stored = localStorage.getItem(key);
    const currentBest = stored ? parseInt(stored, 10) : Infinity;
    if (totalTime < currentBest) {
      localStorage.setItem(key, totalTime.toString());
      setBestTime(totalTime);
    } else {
      setBestTime(currentBest);
    }
  }, [totalTime, puzzle.difficulty]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Puzzle Complete!</h2>
        <div className="text-5xl font-mono font-light mb-6 text-gray-800">
          {formatTime(totalTime)}
        </div>
        <div className="w-full bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600 flex flex-col gap-2">
          <div className="flex justify-between"><span>Base Time:</span> <span>{formatTime(elapsedTime)}</span></div>
          <div className="flex justify-between"><span>Penalties:</span> <span>+{formatTime(penalties)}</span></div>
          <div className="flex justify-between"><span>Hints Used:</span> <span>{hintsUsed}</span></div>
          <div className="flex justify-between"><span>Reveals Used:</span> <span>{revealsUsed}</span></div>
          <div className="h-px bg-gray-200 my-1" />
          <div className="flex justify-between font-bold text-gray-800"><span>Best Time ({puzzle.difficulty}):</span> <span>{bestTime ? formatTime(bestTime) : '--:--'}</span></div>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <button onClick={onNewPuzzle} className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-colors">
            Play Again
          </button>
          <div className="flex gap-2">
            <button onClick={() => onChangeDifficulty('easy')} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">Easy</button>
            <button onClick={() => onChangeDifficulty('medium')} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">Medium</button>
            <button onClick={() => onChangeDifficulty('hard')} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">Hard</button>
          </div>
        </div>
      </div>
    </div>
  );
}
