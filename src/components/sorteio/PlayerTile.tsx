'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  name: string;
  selected: boolean;
  onToggle: () => void;
}

/** Tile de jogador no grid de seleção. */
export function PlayerTile({ name, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        'relative flex min-h-16 items-center justify-center rounded-xl border p-3 text-center text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2',
        selected
          ? 'border-grass bg-grass/20 text-grass-soft focus-visible:ring-grass'
          : 'border-line bg-pitch-soft text-slate-200 hover:border-slate-600 focus-visible:ring-slate-500',
      )}
    >
      {selected && (
        <Check className="absolute right-1.5 top-1.5 size-4 text-grass" />
      )}
      <span className="line-clamp-2 wrap-break-word">{name}</span>
    </button>
  );
}
