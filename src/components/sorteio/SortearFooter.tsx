'use client';

import type { Format } from '@/types';

/** Totais que fecham em times iguais, dentro de {2,3,4}×{5,6,7}. */
const EXACT = [
  { total: 10, label: '2×5' },
  { total: 12, label: '2×6' },
  { total: 14, label: '2×7' },
  { total: 15, label: '3×5' },
  { total: 18, label: '3×6' },
  { total: 20, label: '4×5' },
  { total: 21, label: '3×7' },
  { total: 24, label: '4×6' },
  { total: 28, label: '4×7' },
] as const;

/** Aviso quando N não fecha: sugere o total exato mais próximo abaixo e acima. */
function suggestion(n: number): string {
  const below = [...EXACT].reverse().find((e) => e.total < n);
  const above = EXACT.find((e) => e.total > n);
  const parts: string[] = [];
  if (below) parts.push(`${below.total} (${below.label})`);
  if (above) parts.push(`${above.total} (${above.label})`);
  return `${n} não fecha em times iguais — selecione ${parts.join(' ou ')}.`;
}

interface Props {
  count: number;
  /** Já filtrados para leftover === 0. */
  formats: Format[];
  onPick: (format: Format) => void;
  onClear: () => void;
}

/** Barra fixa: contador + formatos exatos (ou aviso quando nada fecha). */
export function SortearFooter({ count, formats, onPick, onClear }: Props) {
  return (
    <div
      className="fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-20 mx-auto max-w-md space-y-3 border-t border-line bg-pitch/95 px-4 pt-3 backdrop-blur sm:bottom-0"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-base">
          <span className="font-bold text-grass-soft">{count}</span>{' '}
          <span className="text-slate-400">selecionados</span>
        </span>
        {count > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
          >
            Limpar
          </button>
        )}
      </div>

      {formats.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {formats.map((f) => (
            <button
              key={`${f.numTeams}x${f.perTeam}`}
              type="button"
              onClick={() => onPick(f)}
              className="h-12 shrink-0 rounded-xl bg-grass px-5 font-semibold text-pitch transition-colors hover:bg-grass-soft"
            >
              {f.numTeams}×{f.perTeam}
            </button>
          ))}
        </div>
      ) : (
        <p className="pb-1 text-sm text-slate-400">
          {count === 0
            ? 'Toque nos jogadores que vieram hoje.'
            : suggestion(count)}
        </p>
      )}
    </div>
  );
}
