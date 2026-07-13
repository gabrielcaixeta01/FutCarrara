'use client';

import { ChevronDown } from 'lucide-react';
import type { Skill } from '@/types';
import { cn } from '@/lib/utils';

const SKILLS: readonly Skill[] = [0, 1, 2, 3, 4, 5];

interface Props {
  value: Skill;
  onChange: (skill: Skill) => void;
  ariaLabel: string;
  className?: string;
}

/** Seletor de nível 0–5. Select nativo = picker grande e rápido no celular. */
export function SkillSelect({ value, onChange, ariaLabel, className }: Props) {
  return (
    <div className={cn('relative shrink-0', className)}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as Skill)}
        className="h-12 w-16 appearance-none rounded-xl border border-line bg-pitch-soft pl-4 pr-6 text-lg font-bold text-grass-soft focus:border-grass focus:outline-none focus-visible:ring-2 focus-visible:ring-grass"
      >
        {SKILLS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
    </div>
  );
}
