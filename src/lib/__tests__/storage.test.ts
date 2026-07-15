import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearLastResult,
  clearSelection,
  loadLastResult,
  loadSelection,
  saveLastResult,
  saveSelection,
  type DrawSelection,
} from '../storage';
import type { DrawResult, Player, Skill } from '@/types';

/** sessionStorage mínimo em memória — só o que storage.ts usa. */
function fakeSessionStorage(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
}

const player = (name: string, skill: Skill): Player => ({
  id: name,
  name,
  skill,
  active: true,
});

const RESULT: DrawResult = {
  teams: [
    { players: [player('Ana', 3), player('Bruno', 4)], total: 7, avg: 3.5 },
    { players: [player('Carla', 3.5), player('Diego', 3.5)], total: 7, avg: 3.5 },
  ],
  seed: 123,
  spread: 0,
};

describe('storage (com sessionStorage)', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { sessionStorage: fakeSessionStorage() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('faz round-trip do resultado', () => {
    saveLastResult(RESULT);
    expect(loadLastResult()).toEqual(RESULT);
  });

  it('round-trip preserva starters, next e starterSeed', () => {
    const withStarters: DrawResult = {
      ...RESULT,
      starters: [0, 1],
      next: 2,
      starterSeed: 456,
    };
    saveLastResult(withStarters);
    expect(loadLastResult()).toEqual(withStarters);
  });

  it('clearLastResult apaga o resultado', () => {
    saveLastResult(RESULT);
    clearLastResult();
    expect(loadLastResult()).toBeNull();
  });

  it('JSON corrompido não derruba: retorna null', () => {
    window.sessionStorage.setItem('futcarrara:lastResult', '{corrompido');
    expect(loadLastResult()).toBeNull();
  });

  it('shape errado é rejeitado (skill fora dos passos de 0.5)', () => {
    const invalid = {
      ...RESULT,
      teams: [{ players: [{ ...player('Ana', 3), skill: 3.7 }], total: 3.7, avg: 3.7 }],
    };
    window.sessionStorage.setItem('futcarrara:lastResult', JSON.stringify(invalid));
    expect(loadLastResult()).toBeNull();
  });

  it('faz round-trip da seleção', () => {
    const selection: DrawSelection = {
      selectedIds: ['a', 'b', 'c'],
      guests: [{ ...player('Zé', 3), guest: true }],
    };
    saveSelection(selection);
    expect(loadSelection()).toEqual(selection);
  });

  it('clearSelection apaga a seleção', () => {
    saveSelection({ selectedIds: ['a'], guests: [] });
    clearSelection();
    expect(loadSelection()).toBeNull();
  });

  it('seleção com shape errado é rejeitada', () => {
    window.sessionStorage.setItem(
      'futcarrara:selection',
      JSON.stringify({ selectedIds: [1, 2], guests: [] }),
    );
    expect(loadSelection()).toBeNull();
  });

  it('resultado e seleção não se atropelam (chaves distintas)', () => {
    saveLastResult(RESULT);
    saveSelection({ selectedIds: ['a'], guests: [] });
    expect(loadLastResult()).toEqual(RESULT);
    expect(loadSelection()).toEqual({ selectedIds: ['a'], guests: [] });
  });
});

describe('storage (sem window — SSR)', () => {
  it('load retorna null e save/clear não lançam', () => {
    expect(loadLastResult()).toBeNull();
    expect(loadSelection()).toBeNull();
    expect(() => saveLastResult(RESULT)).not.toThrow();
    expect(() => saveSelection({ selectedIds: [], guests: [] })).not.toThrow();
    expect(() => clearLastResult()).not.toThrow();
    expect(() => clearSelection()).not.toThrow();
  });
});
