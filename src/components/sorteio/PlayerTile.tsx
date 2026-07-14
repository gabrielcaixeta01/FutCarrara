'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HalfMark } from '@/components/ui/HalfMark';

interface Props {
  name: string;
  selected: boolean;
  half: boolean;
  onToggle: () => void;
}

/** Tile de jogador no grid de seleção. */
export function PlayerTile({ name, selected, half, onToggle }: Props) {
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
      <span className="line-clamp-2 wrap-break-word">
        {name}
        {half && <HalfMark className="ml-1" />}
      </span>
    </button>
  );
}
