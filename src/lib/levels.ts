import type { Skill } from '@/types';

/**
 * Rótulo humano de cada nível base (0–5). Fonte única de verdade.
 * O meio ponto (.5) é um modificador visual DENTRO do nível, não um nível novo.
 * Não hardcode esses textos em componente: use levelName()/levelLabel().
 */
export const LEVEL_NAMES = {
  5: 'Monstro',
  4: 'Craque',
  3: 'Joga bem',
  2: 'Se vira',
  1: 'Esforçado',
  0: 'Vai pro gol',
} as const;

/** Nível base (grupo): 0..5 inteiro. */
export type Level = keyof typeof LEVEL_NAMES;

/** Níveis do mais alto pro mais baixo — ordem de exibição dos grupos. */
export const LEVELS_DESC: Level[] = [5, 4, 3, 2, 1, 0];

/** Nível base de um skill. 4.5 → 4. */
export function levelOf(skill: Skill): Level {
  return Math.floor(skill) as Level;
}

/** É meio ponto? 4.5 → true, 4 → false. */
export function isHalf(skill: Skill): boolean {
  return skill % 1 !== 0;
}

/** Nome do nível base, sem o modificador. */
export function levelName(skill: Skill): string {
  return LEVEL_NAMES[levelOf(skill)];
}

/**
 * Nome + modificador de meio ponto. Ex.: 'Craque ▲', 'Craque'.
 * 5.0 é o teto (não existe 5.5), então 'Monstro' nunca recebe o ▲.
 */
export function levelLabel(skill: Skill): string {
  return isHalf(skill) ? `${levelName(skill)} ▲` : levelName(skill);
}
