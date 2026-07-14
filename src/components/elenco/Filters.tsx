'use client';

import { X } from 'lucide-react';
import type { Skill } from '@/types';
import { LEVEL_NAMES, SKILL_ORDER } from '@/lib/levels';
import { cn } from '@/lib/utils';

export type StatusFilter = 'all' | 'active' | 'inactive';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'inactive', label: 'Inativos' },
];

interface Props {
  /** Contagem por nível dentro do contexto atual (nome + status). */
  levelCounts: Record<Skill, number>;
  selectedLevels: Set<Skill>;
  onToggleLevel: (skill: Skill) => void;
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
      <div className="flex flex-wrap gap-2">
        {SKILL_ORDER.map((skill) => {
          const count = levelCounts[skill];
          const selected = selectedLevels.has(skill);
          return (
            <button
              key={skill}
              type="button"
              onClick={() => onToggleLevel(skill)}
              disabled={count === 0 && !selected}
              aria-pressed={selected}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors disabled:opacity-40',
                selected
                  ? 'border-grass bg-grass/20 text-grass-soft'
                  : 'border-line bg-pitch-soft text-slate-300 hover:border-slate-600',
              )}
            >
              {LEVEL_NAMES[skill]}
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
