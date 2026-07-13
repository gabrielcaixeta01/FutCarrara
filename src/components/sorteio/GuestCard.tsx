'use client';

import { X } from 'lucide-react';
import type { Player, Skill } from '@/types';
import { SkillSelect } from '@/components/ui/SkillSelect';

interface Props {
  guest: Player;
  onSkill: (skill: Skill) => void;
  onRemove: () => void;
}

/** Card de visitante: nível editável inline, badge e X pra remover. */
export function GuestCard({ guest, onSkill, onRemove }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-grass bg-grass/10 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-medium text-slate-100">
            {guest.name}
          </span>
          <span className="rounded-full bg-grass/20 px-2 py-0.5 text-xs font-medium text-grass-soft">
            visitante
          </span>
        </div>
      </div>

      <SkillSelect
        value={guest.skill}
        onChange={onSkill}
        ariaLabel={`Nível de ${guest.name}`}
      />

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remover visitante ${guest.name}`}
        className="flex size-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-red-500/15 hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        <X className="size-5" />
      </button>
    </div>
  );
}
