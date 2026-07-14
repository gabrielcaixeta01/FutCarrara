import type { Skill } from '@/types';

/**
 * Rótulo humano de cada nível (0–5). Fonte única de verdade.
 * O número (skill) segue igual no modelo/algoritmo/storage — isto é só UI.
 * Não hardcode esses textos em componente: use levelName().
 */
export const LEVEL_NAMES: Record<Skill, string> = {
  5: 'Monstro',
  4: 'Craque',
  3: 'Joga bem',
  2: 'Se vira',
  1: 'Esforçado',
  0: 'Vai pro gol',
};

/** Níveis do mais alto pro mais baixo — ordem de exibição dos grupos. */
export const LEVELS_DESC: Skill[] = [5, 4, 3, 2, 1, 0];

export function levelName(skill: Skill): string {
  return LEVEL_NAMES[skill];
}
