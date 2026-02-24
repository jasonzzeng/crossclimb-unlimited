import { formatTime } from '../../utils/time';
import { Settings } from 'lucide-react';

export function TopBar({ time, onChangeDifficulty }: { time: number, onChangeDifficulty: () => void }) {
  return (
    <header className="w-full h-14 bg-white border-b flex items-center justify-between px-4 shadow-sm">
      <div className="font-bold text-xl tracking-tight flex items-center gap-2">
        <span className="text-gray-800">Crossclimb</span>
        <span className="text-gray-400 font-normal text-sm">Unlimited</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="font-mono text-lg font-medium text-gray-700">
          {formatTime(time)}
        </div>
        <button 
          onClick={onChangeDifficulty}
          className="p-2 text-gray-500 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
          title="Change Difficulty"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}
