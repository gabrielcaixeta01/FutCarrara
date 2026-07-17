'use client';

import { Star } from 'lucide-react';
import type { Skill } from '@/types';
import { isHalf, levelLabel, levelOf } from '@/lib/levels';

/** Slot de estrela: vazia (0), meia (0.5) ou cheia (1). A meia é a estrela
    cheia recortada em 50% por cima da vazia — mesma ideia do meio-pip. */
function StarSlot({ fill }: { fill: 0 | 0.5 | 1 }) {
  return (
    <span className="relative inline-flex size-3">
      <Star className="size-3 fill-pitch-raised text-pitch-raised" />
      {fill > 0 && (
        <span
          className="absolute inset-0 overflow-hidden"
          style={fill === 0.5 ? { width: '50%' } : undefined}
        >
          <Star className="size-3 fill-grass text-grass" />
        </span>
      )}
    </span>
  );
}

/** Nível em 5 estrelas, preenchidas até o nível base; o meio ponto vira uma
    estrela meia-cheia. Indicador único de nível no elenco e no resultado. */
export function LevelStars({ skill }: { skill: Skill }) {
  const level = levelOf(skill);
  const half = isHalf(skill);
  return (
    <span
      className="flex shrink-0 items-center gap-0.5"
      role="img"
      aria-label={levelLabel(skill)}
      title={levelLabel(skill)}
    >
      {([1, 2, 3, 4, 5] as const).map((i) => (
        <StarSlot
          key={i}
          fill={i <= level ? 1 : i === level + 1 && half ? 0.5 : 0}
        />
      ))}
    </span>
  );
}
