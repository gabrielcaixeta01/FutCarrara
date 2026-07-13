'use client';

import type { Team } from '@/types';
import { cn } from '@/lib/utils';
import { teamColor } from './teamColors';

interface Props {
  index: number;
  team: Team;
  isStarter: boolean;
  showLevels: boolean;
}

export function TeamCard({ index, team, isStarter, showLevels }: Props) {
  const color = teamColor(index);

  return (
    <section
      className={cn('rounded-2xl border bg-pitch-soft p-4', color.border)}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn('size-3 rounded-full', color.dot)} />
          <h2 className={cn('font-bold', color.text)}>Time {index + 1}</h2>
          {isStarter && (
            <span className="rounded-full bg-grass/20 px-2 py-0.5 text-xs font-medium text-grass-soft">
              começa
            </span>
          )}
        </div>
        {showLevels && (
          <span className="text-xs tabular-nums text-slate-400">
            Soma {team.total} · Média {team.avg}
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
              {p.guest && (
                <span className="shrink-0 rounded-full bg-grass/15 px-1.5 py-0.5 text-xs text-grass-soft">
                  visitante
                </span>
              )}
            </span>
            {showLevels && (
              <span className="shrink-0 tabular-nums text-sm font-semibold text-slate-400">
                {p.skill}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
