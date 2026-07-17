'use client';

import type { Player } from '@/types';
import { levelLabel } from '@/lib/levels';
import { LevelStars } from '@/components/ui/LevelStars';

interface Props {
  player: Player;
  /** Na lista achatada (busca) não há header de grupo — o nome do nível
      entra na própria linha pra ela se explicar sozinha. */
  showLevelName?: boolean;
}

/** Linha do elenco: nome + nível em estrelas. Vive dentro do card do grupo
    (quem desenha borda e divisórias é a lista, não a linha). */
export function PlayerRow({ player, showLevelName = false }: Props) {
  return (
    <li className="flex items-center justify-between gap-4 px-3.5 py-3">
      <span className="min-w-0 flex-1 truncate text-base font-medium text-ink">
        {player.name}
      </span>
      <div className="flex shrink-0 items-center gap-2.5">
        {showLevelName && (
          <span className="text-xs font-medium text-ink-soft">
            {levelLabel(player.skill)}
          </span>
        )}
        <LevelStars skill={player.skill} />
      </div>
    </li>
  );
}
