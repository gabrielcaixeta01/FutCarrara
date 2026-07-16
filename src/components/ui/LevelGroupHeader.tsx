'use client';

import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SelectionState = 'none' | 'partial' | 'all';

interface Props {
  label: string;
  count: number;
  /** Quando presente, vira "selecionar todos" tri-state (uso no /sorteio). */
  selection?: { state: SelectionState; onToggleAll: () => void };
}

/** Header de grupo de nível: rótulo + contagem, com checkbox opcional. */
export function LevelGroupHeader({ label, count, selection }: Props) {
  const inner = (
    <>
      {selection && (
        <span
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded border transition-colors',
            selection.state === 'all'
              ? 'border-grass bg-grass text-pitch'
              : selection.state === 'partial'
                ? 'border-grass text-grass'
                : 'border-ink-soft/40',
          )}
        >
          {selection.state === 'all' && <Check className="size-3.5" strokeWidth={3} />}
          {selection.state === 'partial' && <Minus className="size-3.5" strokeWidth={3} />}
        </span>
      )}
      <span className="font-display text-sm uppercase tracking-widest text-ink">
        {label}
      </span>
      <span className="h-px flex-1 bg-line" />
      <span className="text-xs font-medium text-ink-soft">
        {count} {count === 1 ? 'jogador' : 'jogadores'}
      </span>
    </>
  );

  if (!selection) {
    return (
      <div className="flex w-full items-center gap-3 py-1.5">{inner}</div>
    );
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={
        selection.state === 'all'
          ? true
          : selection.state === 'partial'
            ? 'mixed'
            : false
      }
      aria-label={`Selecionar todos: ${label} (${count})`}
      onClick={selection.onToggleAll}
      className="flex w-full items-center gap-3 rounded-lg py-1.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-grass"
    >
      {inner}
    </button>
  );
}
