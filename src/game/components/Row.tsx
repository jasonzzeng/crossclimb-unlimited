import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { RowState } from '../types';
import { Lock } from 'lucide-react';

export interface RowRef {
  focus: () => void;
}

interface RowProps {
  row: RowState;
  isActive: boolean;
  onClick: () => void;
  onChange: (newWord: string) => void;
  onComplete?: () => void;
  wordLength: number;
  isReadOnly?: boolean;
}

export const Row = forwardRef<RowRef, RowProps>(({ row, isActive, onClick, onChange, onComplete, wordLength, isReadOnly }, ref) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (row.isLocked || isReadOnly) return;
      let targetIndex = row.currentWord.indexOf(' ');
      if (targetIndex === -1) targetIndex = wordLength - 1;
      setTimeout(() => {
        inputRefs.current[targetIndex]?.focus();
      }, 10);
    }
  }));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (isReadOnly) return;
    if (e.key === 'Backspace') {
      if (row.currentWord[index] === ' ' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < wordLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (isReadOnly) return;
    const val = e.target.value.toUpperCase();
    const char = val.slice(-1);
    if (/^[A-Z]$/.test(char) || char === '') {
      const newWordArr = row.currentWord.split('');
      newWordArr[index] = char || ' ';
      const newWord = newWordArr.join('');
      onChange(newWord);
      
      if (char && index < wordLength - 1) {
        inputRefs.current[index + 1]?.focus();
      } else if (char && index === wordLength - 1 && !newWord.includes(' ')) {
        if (onComplete) onComplete();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z]/g, '').slice(0, wordLength);
    if (pasted) {
      const newWordArr = row.currentWord.split('');
      for (let i = 0; i < pasted.length; i++) {
        newWordArr[i] = pasted[i];
      }
      const newWord = newWordArr.join('');
      onChange(newWord);
      
      const nextFocus = Math.min(pasted.length, wordLength - 1);
      if (!newWord.includes(' ')) {
        if (onComplete) onComplete();
      } else {
        inputRefs.current[nextFocus]?.focus();
      }
    }
  };

  if (row.isLocked) {
    return (
      <div className="w-full h-14 bg-[#fcdbbd] rounded flex items-center justify-center cursor-not-allowed mx-auto">
        <Lock className="text-gray-800" size={20} />
      </div>
    );
  }

  return (
    <div
      className={`relative flex gap-2 p-3 rounded transition-colors w-full mx-auto justify-center
        ${isActive ? 'bg-[#8ecbda]' : 'bg-[#f0f0f0]'} 
        ${row.status === 'incorrect' ? 'overflow-hidden' : ''}`}
      onClick={onClick}
    >
      {row.status === 'incorrect' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-full h-0.5 bg-red-500 rotate-[-5deg]" />
        </div>
      )}
      {Array.from({ length: wordLength }).map((_, i) => {
        const char = row.currentWord[i];
        const isRevealed = row.revealedIndices.includes(i);
        
        const colorClass = `
          ${isActive ? 'border-gray-800' : 'border-gray-300'}
          ${isRevealed ? 'text-blue-700' : 'text-gray-900'}
          ${row.status === 'correct' ? 'text-green-700' : ''}
        `;

        if (isReadOnly) {
          return (
            <div key={i} className={`w-12 h-14 flex items-center justify-center text-3xl font-bold uppercase border-b-2 transition-colors ${colorClass}`}>
              {char === ' ' ? '' : char}
            </div>
          );
        }

        return (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            className={`w-12 h-14 text-center text-3xl font-bold uppercase border-b-2 bg-transparent outline-none transition-colors ${colorClass}`}
            value={char === ' ' ? '' : char}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            onFocus={onClick}
            maxLength={2}
          />
        );
      })}
    </div>
  );
});

