'use client';

import type { Format } from '@/types';
import { validFormats } from '@/lib/balance';

/**
 * Totais que fecham em times iguais, derivados do próprio balance.ts — a fonte
 * única dos formatos. O `n` alto em validFormats é só pra enumerar todas as
 * combinações; o total real é numTeams×perTeam. Empate de total fica com o
 * arranjo de mais times (20 → 4×5, não “2×10”), como o sorteio prefere.
 */
const EXACT: readonly { total: number; label: string }[] = (() => {
  const byTotal = new Map<number, string>();
  const all = [...validFormats(999)].sort((a, b) => b.numTeams - a.numTeams);
  for (const f of all) {
    const total = f.numTeams * f.perTeam;
    if (!byTotal.has(total)) byTotal.set(total, `${f.numTeams}×${f.perTeam}`);
  }
  return [...byTotal.entries()]
    .map(([total, label]) => ({ total, label }))
    .sort((a, b) => a.total - b.total);
})();

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
  const content = (
    <>
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
            ? 'Toque nos jogadores que vão jogar.'
            : suggestion(count)}
        </p>
      )}
    </>
  );

  if (count === 0) {
    return (
      <div className="mt-4 rounded-2xl border border-line bg-pitch-soft px-4 py-3">
        {content}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-x-0 bottom-[calc(7rem+env(safe-area-inset-bottom))] z-20 mx-auto max-w-md space-y-3 border-t border-line bg-pitch/95 px-4 pt-3 backdrop-blur"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      {content}
    </div>
  );
}
