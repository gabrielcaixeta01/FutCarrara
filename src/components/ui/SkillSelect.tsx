'use client';

import { ChevronDown } from 'lucide-react';
import { SKILL_VALUES, type Skill } from '@/types';
import { LEVELS_DESC, levelLabel } from '@/lib/levels';
import { cn } from '@/lib/utils';

interface Props {
  value: Skill;
  onChange: (skill: Skill) => void;
  ariaLabel: string;
  /** Largura do wrapper. Default cabe o rótulo mais longo. */
  className?: string;
  /**
   * Só os 6 níveis inteiros, sem meio ponto. Pra quem não dá pra cravar a
   * habilidade — visitante, por exemplo.
   */
  wholeLevelsOnly?: boolean;
}

/**
 * Seletor de nível. 11 opções (passo 0.5) ou 6 com `wholeLevelsOnly`; o texto é
 * o rótulo com modificador (ex.: "Craque ▲"), o value é o número (Skill).
 */
export function SkillSelect({
  value,
  onChange,
  ariaLabel,
  className,
  wholeLevelsOnly = false,
}: Props) {
  const options: Skill[] = wholeLevelsOnly ? LEVELS_DESC : SKILL_VALUES;

  return (
    <div className={cn('relative', className ?? 'w-36 shrink-0')}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as Skill)}
        className="h-12 w-full appearance-none rounded-xl border border-line bg-pitch-soft pl-3 pr-8 text-sm font-medium text-grass-soft focus:border-grass focus:outline-none focus-visible:ring-2 focus-visible:ring-grass"
      >
        {options.map((s) => (
          <option key={s} value={s}>
            {levelLabel(s)}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
    </div>
  );
}
