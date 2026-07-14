'use client';

import { ChevronDown } from 'lucide-react';
import type { Skill } from '@/types';
import { LEVELS_DESC, levelName } from '@/lib/levels';
import { cn } from '@/lib/utils';

interface Props {
  value: Skill;
  onChange: (skill: Skill) => void;
  ariaLabel: string;
  className?: string;
}

/**
 * Seletor de nível. As opções mostram o rótulo (Monstro…Vai pro gol);
 * o value continua sendo o número (Skill). Select nativo = picker rápido no celular.
 */
export function SkillSelect({ value, onChange, ariaLabel, className }: Props) {
  return (
    <div className={cn('relative shrink-0', className)}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as Skill)}
        className="h-12 w-32 appearance-none rounded-xl border border-line bg-pitch-soft pl-3 pr-8 text-sm font-medium text-grass-soft focus:border-grass focus:outline-none focus-visible:ring-2 focus-visible:ring-grass"
      >
        {LEVELS_DESC.map((s) => (
          <option key={s} value={s}>
            {levelName(s)}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
    </div>
  );
}
