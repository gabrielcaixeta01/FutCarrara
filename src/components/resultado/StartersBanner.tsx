'use client';

import { Shuffle } from 'lucide-react';
import type { Selecao } from '@/lib/teams';

interface Props {
  starters: [number, number];
  /** Próximo time a entrar. Ausente quando não há times de fora. */
  next?: number;
  /** Seleções sorteadas, na ordem dos times. Indexadas por número do time. */
  selecoes: Selecao[];
  onReroll: () => void;
}

/** Destaque de quem começa + re-sorteio só dos starters (times intactos). */
export function StartersBanner({ starters, next, selecoes, onReroll }: Props) {
  const [a, b] = starters;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-grass/40 bg-grass/10 px-4 py-3">
      <div className="space-y-0.5">
        <p className="text-sm text-ink">
          <span className="font-semibold text-grass-soft">Começam:</span>{' '}
          {selecoes[a]?.name} × {selecoes[b]?.name}
        </p>
        {next !== undefined && (
          <p className="text-xs text-ink-soft">
            Próximo a entrar: {selecoes[next]?.name}
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
