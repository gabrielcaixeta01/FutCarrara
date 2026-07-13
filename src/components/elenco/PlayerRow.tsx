'use client';

import { Trash2 } from 'lucide-react';
import type { Player, Skill } from '@/types';
import { cn } from '@/lib/utils';
import { SkillSelect } from './SkillSelect';
import { Toggle } from './Toggle';

interface Props {
  player: Player;
  onSkill: (skill: Skill) => void;
  onToggle: () => void;
  onRemove: () => void;
}

export function PlayerRow({ player, onSkill, onToggle, onRemove }: Props) {
  return (
    <li
      className={cn(
        'flex items-center gap-3 rounded-xl border border-line bg-pitch-soft px-3 py-2.5 transition-opacity',
        !player.active && 'opacity-45',
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-medium text-slate-100">
          {player.name}
        </span>
        {!player.active && (
          <span className="text-xs text-slate-500">Fora do grupo</span>
        )}
      </span>

      <SkillSelect
        value={player.skill}
        onChange={onSkill}
        ariaLabel={`Nível de ${player.name}`}
      />

      <Toggle
        checked={player.active}
        onChange={onToggle}
        ariaLabel={`${player.name}: ${player.active ? 'ativo, tocar para desativar' : 'inativo, tocar para ativar'}`}
      />

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remover ${player.name}`}
        className="flex size-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-red-500/15 hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        <Trash2 className="size-5" />
      </button>
    </li>
  );
}
