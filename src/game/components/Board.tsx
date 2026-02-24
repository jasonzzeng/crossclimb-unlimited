import React, { useEffect, useRef } from 'react';
import { Row, RowRef } from './Row';
import { differsByOneLetter } from '../differsByOneLetter';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableRowItem({ id, row, index, isActive, onClick, onChange, onComplete, wordLength, canReorder, isNextValid, moveRow, isLast, rowsLength, rowRef, isReadOnly }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !canReorder });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    position: 'relative' as const,
  };

  const isMiddle = row.type === 'middle';

  return (
    <div ref={setNodeRef} style={style} className={`relative flex items-center justify-center ${isDragging ? 'scale-105 opacity-90' : ''}`}>
      {/* Left Drag Handle */}
      {isMiddle && (
        <div 
          {...attributes}
          {...listeners}
          className={`absolute -left-10 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 ${canReorder ? 'cursor-grab active:cursor-grabbing hover:bg-gray-50 hover:text-gray-800' : 'opacity-50 cursor-not-allowed'}`}
        >
          <span className="font-bold text-lg leading-none">=</span>
        </div>
      )}

      <div className="w-full relative z-10">
        <Row
          ref={rowRef}
          row={row}
          isActive={isActive}
          onClick={onClick}
          onChange={onChange}
          onComplete={onComplete}
          wordLength={wordLength}
          isReadOnly={isReadOnly}
        />
      </div>

      {/* Right Drag Handle */}
      {isMiddle && (
        <div 
          {...attributes}
          {...listeners}
          className={`absolute -right-10 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 ${canReorder ? 'cursor-grab active:cursor-grabbing hover:bg-gray-50 hover:text-gray-800' : 'opacity-50 cursor-not-allowed'}`}
        >
          <span className="font-bold text-lg leading-none">=</span>
        </div>
      )}
      
      {/* Reorder buttons for accessibility (only when active and can reorder) */}
      {isActive && canReorder && (
        <div className="absolute -right-20 top-0 bottom-0 flex flex-col justify-center gap-1 z-20">
          <button 
            onClick={() => moveRow(index, index - 1)} 
            disabled={index === 1}
            className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-30"
            aria-label="Move row up"
          >
            <ChevronUp size={16} />
          </button>
          <button 
            onClick={() => moveRow(index, index + 1)} 
            disabled={index === rowsLength - 2}
            className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-30"
            aria-label="Move row down"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      {/* Valid connector lines */}
      {isNextValid && (
        <>
          <div className="absolute left-[10px] -bottom-4 w-3 h-5 bg-green-500 z-0" />
          <div className="absolute right-[10px] -bottom-4 w-3 h-5 bg-green-500 z-0" />
        </>
      )}
    </div>
  );
}

export function Board({ gameState, wordLength }: { gameState: any, wordLength: number }) {
  const { rows, activeRowIndex, setActiveRowIndex, updateRow, moveRow, stage, flipMiddle, advanceToNextRow } = gameState;
  const rowRefs = useRef<(RowRef | null)[]>([]);

  useEffect(() => {
    if (activeRowIndex >= 0 && activeRowIndex < rows.length) {
      rowRefs.current[activeRowIndex]?.focus();
    }
  }, [activeRowIndex]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = rows.findIndex((r: any) => r.id === active.id);
      const newIndex = rows.findIndex((r: any) => r.id === over.id);
      
      if (oldIndex > 0 && oldIndex < rows.length - 1 && newIndex > 0 && newIndex < rows.length - 1) {
        moveRow(oldIndex, newIndex);
      }
    }
  };

  if (rows.length === 0) return null;

  const topRow = rows[0];
  const bottomRow = rows[rows.length - 1];
  const middleRows = rows.slice(1, rows.length - 1);

  const isTopNextValid = !topRow.currentWord.includes(' ') && !middleRows[0].currentWord.includes(' ') && differsByOneLetter(topRow.currentWord, middleRows[0].currentWord);

  return (
    <div className="relative flex flex-col gap-4 w-full max-w-md mx-auto">
      {/* Vertical lines */}
      <div className="absolute left-[16px] top-6 bottom-6 w-px bg-gray-300" />
      <div className="absolute right-[16px] top-6 bottom-6 w-px bg-gray-300" />

      {stage === 'ARRANGE' && (
        <div className="absolute -top-16 left-0 right-0 text-center text-sm font-medium text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200 shadow-sm z-20">
          Now arrange the words using the "=" so that only one letter changes at a time to reveal the last two clues.
        </div>
      )}

      {/* Top Row */}
      <div className="relative flex items-center justify-center z-10">
        <div className="w-full relative z-10">
          <Row
            ref={el => rowRefs.current[0] = el}
            row={topRow}
            isActive={0 === activeRowIndex}
            onClick={() => setActiveRowIndex(0)}
            onChange={(val: string) => updateRow(0, { currentWord: val, status: 'normal' })}
            onComplete={() => advanceToNextRow(0)}
            wordLength={wordLength}
            isReadOnly={topRow.isLocked || stage === 'COMPLETED'}
          />
        </div>
        {/* Valid connector lines */}
        {isTopNextValid && (
          <>
            <div className="absolute left-[10px] -bottom-4 w-3 h-5 bg-green-500 z-0" />
            <div className="absolute right-[10px] -bottom-4 w-3 h-5 bg-green-500 z-0" />
          </>
        )}
      </div>

      {/* Middle Rows */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={middleRows.map((r: any) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          {middleRows.map((row: any, midIndex: number) => {
            const i = midIndex + 1;
            const isNextValid = i < rows.length - 1 &&
              !row.currentWord.includes(' ') &&
              !rows[i+1].currentWord.includes(' ') &&
              differsByOneLetter(row.currentWord, rows[i+1].currentWord);

            const canReorder = stage !== 'FINAL' && stage !== 'COMPLETED';
            const isReadOnly = stage !== 'FILL';

            return (
              <SortableRowItem
                key={row.id}
                id={row.id}
                row={row}
                index={i}
                isActive={i === activeRowIndex}
                onClick={() => setActiveRowIndex(i)}
                onChange={(val: string) => updateRow(i, { currentWord: val, status: 'normal' })}
                onComplete={() => advanceToNextRow(i)}
                wordLength={wordLength}
                canReorder={canReorder}
                isNextValid={isNextValid}
                moveRow={moveRow}
                isLast={i === rows.length - 1}
                rowsLength={rows.length}
                rowRef={(el: RowRef | null) => rowRefs.current[i] = el}
                isReadOnly={isReadOnly}
              />
            );
          })}
        </SortableContext>
      </DndContext>

      {/* Bottom Row */}
      <div className="relative flex items-center justify-center z-10">
        <div className="w-full relative z-10">
          <Row
            ref={el => rowRefs.current[rows.length - 1] = el}
            row={bottomRow}
            isActive={rows.length - 1 === activeRowIndex}
            onClick={() => setActiveRowIndex(rows.length - 1)}
            onChange={(val: string) => updateRow(rows.length - 1, { currentWord: val, status: 'normal' })}
            onComplete={() => advanceToNextRow(rows.length - 1)}
            wordLength={wordLength}
            isReadOnly={bottomRow.isLocked || stage === 'COMPLETED'}
          />
        </div>
      </div>

      {stage === 'FINAL' && (
        <div className="absolute -right-28 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center max-w-[80px]">Order Locked</div>
          <button 
            onClick={flipMiddle}
            className="flex flex-col items-center justify-center p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 transition-colors"
            title="Flip middle order"
          >
            <ArrowUpDown size={20} className="mb-1" />
            <span className="text-[10px] font-bold uppercase">Flip</span>
          </button>
        </div>
      )}
    </div>
  );
}

