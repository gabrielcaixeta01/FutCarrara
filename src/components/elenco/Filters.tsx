'use client';

import { X } from 'lucide-react';
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
  anyActive: boolean;
  onClear: () => void;
}

export function Filters({
  levelCounts,
  selectedLevels,
  onToggleLevel,
  status,
  onStatus,
  anyActive,
  onClear,
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
                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors disabled:opacity-40',
                selected
                  ? 'border-grass bg-grass/20 text-grass-soft'
                  : 'border-line bg-pitch-soft text-slate-300 hover:border-slate-600',
              )}
            >
              {levelName(level)}
              <span
                className={cn(
                  'tabular-nums text-xs',
                  selected ? 'text-grass-soft' : 'text-slate-500',
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filtrar por status"
          className="inline-flex rounded-xl border border-line bg-pitch-soft p-1"
        >
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onStatus(s.value)}
              aria-pressed={status === s.value}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                status === s.value
                  ? 'bg-grass text-pitch'
                  : 'text-slate-300 hover:text-slate-100',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {anyActive && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-slate-100"
          >
            <X className="size-4" />
            limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}
