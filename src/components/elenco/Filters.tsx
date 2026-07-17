'use client';

import { LEVELS_DESC, levelName, type Level } from '@/lib/levels';
import { cn } from '@/lib/utils';

export type StatusFilter = 'active' | 'inactive';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'active', label: 'Em atividade' },
  { value: 'inactive', label: 'Aposentados' },
];

interface Props {
  /** Contagem por nível base dentro do contexto atual (nome + status). */
  levelCounts: Record<Level, number>;
  selectedLevels: Set<Level>;
  onToggleLevel: (level: Level) => void;
  status: StatusFilter;
  onStatus: (status: StatusFilter) => void;
}

export function Filters({
  levelCounts,
  selectedLevels,
  onToggleLevel,
  status,
  onStatus,
}: Props) {
  return (
    <div className="space-y-3">
      <div
        role="group"
        aria-label="Filtrar por nível"
        className="flex flex-wrap gap-2"
      >
        {LEVELS_DESC.map((level) => {
          const count = levelCounts[level];
          const selected = selectedLevels.has(level);
          return (
            <button
              key={level}
              type="button"
              onClick={() => onToggleLevel(level)}
              disabled={count === 0 && !selected}
              aria-pressed={selected}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all active:scale-[0.96] disabled:opacity-40',
                selected
                  ? 'border-grass bg-grass font-medium text-pitch'
                  : 'border-line bg-pitch-soft text-ink-soft hover:border-ink-soft/40',
              )}
            >
              {levelName(level)}
              <span
                className={cn(
                  'tabular-nums text-xs',
                  selected ? 'text-pitch/70' : 'text-ink-soft/75',
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="group"
        aria-label="Filtrar por status"
        className="flex w-full rounded-xl border border-line bg-pitch-soft p-1"
      >
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onStatus(s.value)}
            aria-pressed={status === s.value}
            className={cn(
              'flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              status === s.value
                ? 'bg-grass text-pitch'
                : 'text-ink-soft hover:text-ink',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
