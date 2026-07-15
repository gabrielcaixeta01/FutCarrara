'use client';

import type { Team } from '@/types';
import { isHalf, levelName } from '@/lib/levels';
import { cn } from '@/lib/utils';
import { HalfMark } from '@/components/ui/HalfMark';
import { teamColor } from './teamColors';

interface Props {
  index: number;
  team: Team;
  showLevels: boolean;
}

export function TeamCard({ index, team, showLevels }: Props) {
  const color = teamColor(index);

  return (
    <section
      className={cn('rounded-2xl border bg-pitch-soft p-4', color.border)}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn('size-3 shrink-0 rounded-full', color.dot)} />
          <h2 className={cn('truncate font-bold', color.text)}>
            Time {index + 1}
          </h2>
        </div>
        {showLevels && (
          <span
            title="média do time"
            className="shrink-0 text-xs font-medium tabular-nums text-slate-500"
          >
            {team.avg.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
          </span>
        )}
      </header>

      <ul className="space-y-1.5">
        {team.players.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between gap-2 text-slate-100"
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
              <span className="shrink-0 text-sm font-medium text-slate-400">
                {levelName(p.skill)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
