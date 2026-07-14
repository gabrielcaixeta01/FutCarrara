'use client';

import type { Player } from '@/types';
import { isHalf } from '@/lib/levels';
import { cn } from '@/lib/utils';
import { HalfMark } from '@/components/ui/HalfMark';

interface Props {
  player: Player;
}

export function PlayerRow({ player }: Props) {
  return (
    <li
      className={cn(
        'flex items-center justify-between gap-4 rounded-xl border border-line bg-pitch-soft p-3 transition-opacity',
        !player.active && 'opacity-45',
      )}
    >
      <span className="min-w-0 flex-1 truncate text-base font-medium text-slate-100">
        {player.name}
      </span>
      <div className="flex shrink-0 items-center gap-2">
        {isHalf(player.skill) && <HalfMark className="shrink-0" />}
        {!player.active && (
          <span className="rounded-full bg-slate-700/50 px-2 py-0.5 text-xs text-slate-400">
            Aposentado
          </span>
        )}
      </div>
    </li>
  );
}
