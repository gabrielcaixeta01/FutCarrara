'use client';

import { useState } from 'react';
import { Shuffle } from 'lucide-react';
import type { Format } from '@/types';
import { validFormats } from '@/lib/balance';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

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

/** Instrução acionável quando N não fecha: o que fazer pra chegar num total exato. */
function suggestion(n: number): string {
  const below = [...EXACT].reverse().find((e) => e.total < n);
  const above = EXACT.find((e) => e.total > n);
  const parts: string[] = [];
  if (below) parts.push(`tire ${n - below.total} (${below.label})`);
  if (above) parts.push(`chame +${above.total - n} (${above.label})`);
  return `${n} não fecha em times iguais — ${parts.join(' ou ')}.`;
}

interface Props {
  count: number;
  /** Já filtrados para leftover === 0. */
  formats: Format[];
  onPick: (format: Format) => void;
  onClear: () => void;
}

/**
 * Barra fixa de status + ação. Dentro de {2,3,4}×{5,6,7} cada total fecha em
 * no máximo UM formato, então isto nunca é uma escolha entre botões: quando
 * fecha, existe um único CTA grande de sortear; quando não fecha, uma
 * instrução do que mudar. Sempre visível, pra tela ter um lugar só de status.
 */
export function SortearFooter({ count, formats, onPick, onClear }: Props) {
  // Limpar descarta dezenas de toques (e visitantes configurados) de uma vez:
  // vale uma pausa antes de acontecer.
  const [confirmClear, setConfirmClear] = useState(false);

  const format = formats[0];

  return (
    <>
      <div className="fixed inset-x-0 bottom-[calc(7rem+env(safe-area-inset-bottom))] z-20 mx-auto max-w-md px-4">
        <div className="space-y-2 rounded-2xl border border-line/70 bg-pitch-soft/95 p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <div className="flex items-center justify-between text-sm">
            <span>
              <span className="font-bold tabular-nums text-grass-soft">
                {count}
              </span>{' '}
              <span className="text-ink-soft">
                {count === 1 ? 'selecionado' : 'selecionados'}
              </span>
            </span>
            {count > 0 && (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="text-sm text-ink-soft underline-offset-2 hover:text-ink hover:underline"
              >
                Limpar
              </button>
            )}
          </div>

          {format ? (
            <button
              type="button"
              onClick={() => onPick(format)}
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-grass text-pitch transition-all hover:bg-grass-soft active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-grass-soft"
            >
              <Shuffle className="size-6" strokeWidth={2.5} />
              <span className="font-display text-2xl uppercase leading-none tracking-wide">
                Sortear {format.numTeams}×{format.perTeam}
              </span>
            </button>
          ) : (
            <p className="pb-0.5 text-sm text-ink-soft">
              {count === 0
                ? 'Toque em quem vai jogar hoje.'
                : suggestion(count)}
            </p>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="Limpar seleção?"
        message="Desmarca todos os selecionados e remove os visitantes de hoje."
        confirmLabel="Limpar"
        onConfirm={() => {
          onClear();
          setConfirmClear(false);
        }}
        onCancel={() => setConfirmClear(false)}
      />
    </>
  );
}
