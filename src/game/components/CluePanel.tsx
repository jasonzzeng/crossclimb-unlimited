import { ChevronUp, ChevronDown } from 'lucide-react';

export function CluePanel({ gameState }: { gameState: any }) {
  const { rows, activeRowIndex, setActiveRowIndex } = gameState;
  const activeRow = rows[activeRowIndex];

  const handlePrev = () => {
    if (activeRowIndex > 0) setActiveRowIndex(activeRowIndex - 1);
  };
  const handleNext = () => {
    if (activeRowIndex < rows.length - 1) setActiveRowIndex(activeRowIndex + 1);
  };

  const clueText = activeRow?.isLocked ? '???' : (activeRow?.clue || 'Select a row');

  return (
    <div className="mt-6 w-full max-w-sm bg-[#f0f0f0] rounded-b-lg p-4 flex items-center justify-between border-t border-gray-200">
      <button onClick={handlePrev} disabled={activeRowIndex === 0} className="p-2 text-gray-500 hover:text-gray-800 disabled:opacity-30">
        <ChevronUp size={20} />
      </button>
      <div className="text-center flex-1 px-4 text-sm font-medium text-gray-800">
        {clueText}
      </div>
      <button onClick={handleNext} disabled={activeRowIndex === rows.length - 1} className="p-2 text-gray-500 hover:text-gray-800 disabled:opacity-30">
        <ChevronDown size={20} />
      </button>
    </div>
  );
}
