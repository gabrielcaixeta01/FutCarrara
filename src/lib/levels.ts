import type { Skill } from '@/types';

/**
 * Rótulo humano de cada nível (0–5). Fonte única de verdade.
 * Não hardcode esses textos em componente — importe daqui.
 */
export const LEVEL_NAMES: Record<Skill, string> = {
  5: 'Elite',
  4: 'Avançado',
  3: 'Intermediário',
  2: 'Regular',
  1: 'Iniciante',
  0: 'Casual',
};

/** Níveis do mais alto pro mais baixo — ordem de exibição dos grupos. */
export const SKILL_ORDER: readonly Skill[] = [5, 4, 3, 2, 1, 0];
