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

/** Tile de jogador no grid de seleção. Selecionado = preenchido de verde:
    quem já foi marcado se enxerga de longe, sem ler tile por tile. */
export function PlayerTile({ name, selected, half, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        'relative flex min-h-16 items-center justify-center rounded-xl border p-3 text-center text-sm font-medium transition-all active:scale-[0.96] focus:outline-none focus-visible:ring-2',
        selected
          ? 'border-grass bg-grass font-semibold text-pitch shadow-[0_6px_18px_-6px_rgba(34,197,94,0.5)] focus-visible:ring-grass-soft'
          : 'border-line bg-pitch-soft text-ink hover:border-ink-soft/40 focus-visible:ring-ink-soft',
      )}
    >
      {selected && (
        <Check
          className="absolute right-1.5 top-1.5 size-4 text-pitch/70"
          strokeWidth={3}
        />
      )}
      <span className="line-clamp-2 wrap-break-word">
        {name}
        {half && (
          <HalfMark className={cn('ml-1', selected && 'text-pitch/70')} />
        )}
      </span>
    </button>
  );
}
