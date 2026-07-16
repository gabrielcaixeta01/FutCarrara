'use client';

import { Shuffle } from 'lucide-react';

interface Props {
  starters: [number, number];
  /** Próximo time a entrar. Ausente quando não há times de fora. */
  next?: number;
  onReroll: () => void;
}

/** Destaque de quem começa + re-sorteio só dos starters (times intactos). */
export function StartersBanner({ starters, next, onReroll }: Props) {
  const [a, b] = starters;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-grass/40 bg-grass/10 px-4 py-3">
      <div className="space-y-0.5">
        <p className="text-sm text-ink">
          <span className="font-semibold text-grass-soft">Começam:</span> Time{' '}
          {a + 1} × Time {b + 1}
        </p>
        {next !== undefined && (
          <p className="text-xs text-ink-soft">
            Próximo a entrar: Time {next + 1}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onReroll}
        className="flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-grass-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-grass focus-visible:rounded"
      >
        <Shuffle className="size-4" />
        sortear quem começa
      </button>
    </div>
  );
}
