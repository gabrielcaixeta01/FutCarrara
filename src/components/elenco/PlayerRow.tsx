'use client';

import { Trash2 } from 'lucide-react';
import type { Player, Skill } from '@/types';
import { isHalf } from '@/lib/levels';
import { cn } from '@/lib/utils';
import { SkillSelect } from '@/components/ui/SkillSelect';
import { HalfMark } from '@/components/ui/HalfMark';
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
        'space-y-2 rounded-xl border border-line bg-pitch-soft p-3 transition-opacity',
        !player.active && 'opacity-45',
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="truncate text-base font-medium text-slate-100">
            {player.name}
          </span>
          {isHalf(player.skill) && <HalfMark />}
          {!player.active && (
            <span className="shrink-0 rounded-full bg-slate-700/50 px-2 py-0.5 text-xs text-slate-400">
              Aposentado
            </span>
          )}
        </span>

        <Toggle
          checked={player.active}
          onChange={onToggle}
          ariaLabel={`${player.name}: ${player.active ? 'ativo, tocar para aposentar' : 'aposentado, tocar para reativar'}`}
        />
      </div>

      <div className="flex items-center gap-2">
        <SkillSelect
          value={player.skill}
          onChange={onSkill}
          ariaLabel={`Nível de ${player.name}`}
          className="flex-1"
        />
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover ${player.name}`}
          className="flex size-12 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-red-500/15 hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          <Trash2 className="size-5" />
        </button>
      </div>
    </li>
  );
}
