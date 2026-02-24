import React, { useState, useEffect } from 'react';
import { LocalPuzzleSource } from './game/puzzleSources/LocalPuzzleSource';
import { Puzzle, Difficulty } from './game/types';
import { useGameState } from './game/state/useGameState';
import { Board } from './game/components/Board';
import { TopBar } from './game/components/TopBar';
import { CluePanel } from './game/components/CluePanel';
import { CompletionModal } from './game/components/CompletionModal';
import { Toast } from './game/components/Toast';

const puzzleSource = new LocalPuzzleSource();

type AppState = 'menu' | 'playing';

export default function App() {
  const [appState, setAppState] = useState<AppState>('menu');
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const loadPuzzle = async (diff: Difficulty) => {
    const recent = JSON.parse(localStorage.getItem('recentPuzzles') || '[]');
    const newPuzzle = await puzzleSource.getPuzzle(diff, recent);
    setPuzzle(newPuzzle);
    const newRecent = [newPuzzle.id, ...recent].slice(0, 10);
    localStorage.setItem('recentPuzzles', JSON.stringify(newRecent));
    setAppState('playing');
  };

  if (appState === 'menu') {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex flex-col items-center justify-center font-sans text-gray-900 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Crossclimb</h1>
          <p className="text-gray-500 mb-8">Unlimited</p>
          
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Select Difficulty</h2>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => { setDifficulty('easy'); loadPuzzle('easy'); }}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
            >
              Easy (4 letters)
            </button>
            <button 
              onClick={() => { setDifficulty('medium'); loadPuzzle('medium'); }}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
            >
              Medium (5 letters)
            </button>
            <button 
              onClick={() => { setDifficulty('hard'); loadPuzzle('hard'); }}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
            >
              Hard (6 letters)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!puzzle) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <Game 
      key={puzzle.id} 
      puzzle={puzzle} 
      onNewPuzzle={() => loadPuzzle(difficulty)} 
      onChangeDifficulty={() => setAppState('menu')} 
    />
  );
}

interface GameProps {
  puzzle: Puzzle;
  onNewPuzzle: () => void;
  onChangeDifficulty: () => void;
}

function Game({ puzzle, onNewPuzzle, onChangeDifficulty }: GameProps) {
  const gameState = useGameState(puzzle);

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex flex-col items-center font-sans text-gray-900 pb-12">
      <TopBar time={gameState.elapsedTime + gameState.penalties} onChangeDifficulty={onChangeDifficulty} />
      <main className="flex-1 w-full max-w-lg p-4 flex flex-col items-center mt-6">
        <Board gameState={gameState} wordLength={puzzle.wordLength} />
        
        <div className="mt-8 flex gap-4 w-full max-w-sm justify-center">
          <button onClick={gameState.handleReveal} className="px-6 py-2 border border-gray-400 rounded-full hover:bg-gray-200 font-medium text-sm text-gray-700 bg-white shadow-sm">Reveal row</button>
          <button onClick={gameState.handleHint} className="px-6 py-2 border border-gray-400 rounded-full hover:bg-gray-200 font-medium text-sm text-gray-700 bg-white shadow-sm">Hint</button>
        </div>
        
        <CluePanel gameState={gameState} />
      </main>
      
      {gameState.stage === 'COMPLETED' && (
        <CompletionModal gameState={gameState} puzzle={puzzle} onNewPuzzle={onNewPuzzle} onChangeDifficulty={onChangeDifficulty} />
      )}
      {gameState.toastMessage && <Toast message={gameState.toastMessage} />}
      {gameState.stageBanner && <Toast message={gameState.stageBanner} />}
    </div>
  );
}

