'use client';

import type { Team } from '@/types';
import type { Selecao } from '@/lib/teams';
import { isHalf, levelName } from '@/lib/levels';
import { cn } from '@/lib/utils';
import { HalfMark } from '@/components/ui/HalfMark';
import { selecaoColor } from './teamColors';

interface Props {
  selecao: Selecao;
  team: Team;
  showLevels: boolean;
}

export function TeamCard({ selecao, team, showLevels }: Props) {
  const color = selecaoColor(selecao.name);

  return (
    <section
      className={cn(
        'overflow-hidden rounded-2xl border bg-pitch-soft',
        color.border,
      )}
    >
      {/* Faixa da seleção: bandeira + nome dão identidade ao time no reveal. */}
      <header
        className={cn(
          'flex items-center justify-between gap-2 px-4 py-2.5',
          color.soft,
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-xl leading-none" aria-hidden>
            {selecao.flag}
          </span>
          <h2
            className={cn(
              'truncate font-display text-lg uppercase tracking-wide',
              color.text,
            )}
          >
            {selecao.name}
          </h2>
        </div>
        {showLevels && (
          <span className="shrink-0 text-xs font-medium tabular-nums text-ink-soft/80">
            {team.avg.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
          </span>
        )}
      </header>

      <ul className="space-y-1.5 p-4">
        {team.players.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between gap-2 text-ink"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate">{p.name}</span>
              {showLevels && isHalf(p.skill) && <HalfMark className="shrink-0" />}
              {p.guest && (
                <span className="shrink-0 rounded-full bg-grass/15 px-1.5 py-0.5 text-xs text-grass-soft">
                  visitante
                </span>
              )}
            </span>
            {showLevels && (
              <span className="shrink-0 text-sm font-medium text-ink-soft">
                {levelName(p.skill)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
