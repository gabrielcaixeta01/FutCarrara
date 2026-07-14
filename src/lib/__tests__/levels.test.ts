import { describe, it, expect } from 'vitest';
import { levelName, LEVEL_NAMES, LEVELS_DESC } from '../levels';
import type { Skill } from '@/types';

describe('levelName', () => {
  it('nomeia os 6 níveis', () => {
    expect(levelName(5)).toBe('Monstro');
    expect(levelName(4)).toBe('Craque');
    expect(levelName(3)).toBe('Joga bem');
    expect(levelName(2)).toBe('Se vira');
    expect(levelName(1)).toBe('Esforçado');
    expect(levelName(0)).toBe('Vai pro gol');
  });

  it('bate com LEVEL_NAMES em todos os níveis', () => {
    ([0, 1, 2, 3, 4, 5] as Skill[]).forEach((s) =>
      expect(levelName(s)).toBe(LEVEL_NAMES[s]),
    );
  });
});

describe('LEVELS_DESC', () => {
  it('tem os 6 níveis em ordem decrescente', () => {
    expect(LEVELS_DESC).toEqual([5, 4, 3, 2, 1, 0]);
    for (let i = 1; i < LEVELS_DESC.length; i++) {
      expect(LEVELS_DESC[i]).toBeLessThan(LEVELS_DESC[i - 1]!);
    }
  });
});
