'use client';

import type { Player, Skill } from '@/types';
import { isHalf, levelLabel, levelOf } from '@/lib/levels';
import { cn } from '@/lib/utils';

/** Pips de nível: 5 bolinhas, preenchidas até o nível base; o meio ponto
    vira uma bolinha meio-preenchida. Lê-se de relance, sem palavras. */
function LevelPips({ skill }: { skill: Skill }) {
  const level = levelOf(skill);
  const half = isHalf(skill);
  return (
    <span
      className="flex items-center gap-1"
      role="img"
      aria-label={levelLabel(skill)}
      title={levelLabel(skill)}
    >
      {([1, 2, 3, 4, 5] as const).map((i) => (
        <span
          key={i}
          className={cn(
            'size-1.5 rounded-full',
            i <= level
              ? 'bg-grass'
              : i === level + 1 && half
                ? 'bg-[linear-gradient(90deg,var(--color-grass)_50%,var(--color-pitch-raised)_50%)]'
                : 'bg-pitch-raised',
          )}
        />
      ))}
    </span>
  );
}

interface Props {
  player: Player;
  /** Na lista achatada (busca) não há header de grupo — o nome do nível
      entra na própria linha pra ela se explicar sozinha. */
  showLevelName?: boolean;
}

/** Linha do elenco: nome + nível em pips. Vive dentro do card do grupo
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
        <LevelPips skill={player.skill} />
      </div>
    </li>
  );
}
