import { describe, it, expect } from 'vitest';
import { drawTeams, rerollStarters, validFormats } from '../balance';
import type { Player, Skill } from '@/types';

const mk = (skills: number[]): Player[] =>
  skills.map((s, i) => ({
    id: `p${i}`,
    name: `P${i}`,
    skill: s as Skill,
    active: true,
  }));

describe('drawTeams', () => {
  it('lança erro se a conta não fecha', () => {
    expect(() => drawTeams(mk([1, 2, 3]), 2, 6)).toThrow();
  });

  it('distribui todos os jogadores sem repetir nem perder', () => {
    const { teams } = drawTeams(mk([5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0]), 2, 6, 42);
    const ids = teams.flatMap((t) => t.players.map((p) => p.id));
    expect(ids).toHaveLength(12);
    expect(new Set(ids).size).toBe(12);
  });

  it('acha o balanceamento perfeito quando ele existe', () => {
    const { spread } = drawTeams(mk([5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0]), 2, 6, 42);
    expect(spread).toBe(0);
  });

  it('mantém spread baixo em 4 times de 5', () => {
    const pool = mk([5, 5, 5, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0]);
    expect(drawTeams(pool, 4, 5, 7).spread).toBeLessThanOrEqual(1);
  });

  it('é determinístico para a mesma seed', () => {
    const pool = mk([5, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 0]);
    const a = drawTeams(pool, 2, 6, 99);
    const b = drawTeams(pool, 2, 6, 99);
    expect(a.teams.map((t) => t.total)).toEqual(b.teams.map((t) => t.total));
  });

  it('seeds diferentes geram composições diferentes', () => {
    const pool = mk([5, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 0]);
    const ids = (seed: number) =>
      drawTeams(pool, 2, 6, seed).teams[0]!.players.map((p) => p.id).sort();
    expect(ids(1)).not.toEqual(ids(2));
  });

  it('lida com todos os jogadores no mesmo nível', () => {
    expect(drawTeams(mk(Array(12).fill(3)), 2, 6, 5).spread).toBe(0);
  });

  it('funciona com 7 por time', () => {
    const pool = mk([5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 0]);
    const { teams } = drawTeams(pool, 2, 7, 3);
    expect(teams).toHaveLength(2);
    expect(teams[0]!.players).toHaveLength(7);
  });
});

describe('rerollStarters', () => {
  // 18 confirmados → 3×6, então há starters.
  const pool3 = mk([5, 5, 5, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 0]);

  it('não altera a composição dos times', () => {
    const r = drawTeams(pool3, 3, 6, 10);
    const before = r.teams.map((t) => t.players.map((p) => p.id));
    const after = rerollStarters(r, 123);
    expect(after.teams.map((t) => t.players.map((p) => p.id))).toEqual(before);
    expect(after.teams.map((t) => t.total)).toEqual(r.teams.map((t) => t.total));
  });

  it('mesma starterSeed dá os mesmos starters', () => {
    const r = drawTeams(pool3, 3, 6, 10);
    expect(rerollStarters(r, 77).starters).toEqual(rerollStarters(r, 77).starters);
  });

  it('starterSeeds diferentes eventualmente dão starters diferentes', () => {
    const r = drawTeams(pool3, 3, 6, 10);
    const base = rerollStarters(r, 0).starters!;
    let differ = false;
    for (let s = 1; s < 50; s++) {
      const cur = rerollStarters(r, s).starters!;
      if (cur[0] !== base[0] || cur[1] !== base[1]) {
        differ = true;
        break;
      }
    }
    expect(differ).toBe(true);
  });

  it('com 2 times é no-op e starters fica undefined', () => {
    const r = drawTeams(mk([5, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 0]), 2, 6, 10);
    expect(r.starters).toBeUndefined();
    const after = rerollStarters(r, 999);
    expect(after).toBe(r);
    expect(after.starters).toBeUndefined();
  });

  it('(seed, starterSeed) reproduz integralmente um DrawResult', () => {
    const a = drawTeams(pool3, 3, 6, 42, 7);
    const b = drawTeams(pool3, 3, 6, 42, 7);
    expect(a).toEqual(b);
    expect(a.starterSeed).toBe(7);
  });

  it('rerolla o próximo junto com os starters', () => {
    const r = drawTeams(pool3, 3, 6, 10);
    const after = rerollStarters(r, 77);
    expect(after.next).toBeTypeOf('number');
    expect(after.next).toBe(rerollStarters(r, 77).next);
    expect(after.starters).not.toContain(after.next);
  });
});

describe('next (próximo time a entrar)', () => {
  const pool4 = mk([5, 5, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0]);
  const pool3 = mk([5, 5, 5, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 0]);

  it('com 4 times, é um time válido que não está começando', () => {
    for (let seed = 0; seed < 30; seed++) {
      const r = drawTeams(pool4, 4, 5, seed);
      expect(r.next).toBeGreaterThanOrEqual(0);
      expect(r.next).toBeLessThan(4);
      expect(r.starters).not.toContain(r.next);
    }
  });

  it('com 3 times, é o único time que sobra', () => {
    const r = drawTeams(pool3, 3, 6, 10);
    const [a, b] = r.starters!;
    expect(r.next).toBe([0, 1, 2].find((i) => i !== a && i !== b));
  });

  it('com 2 times não existe', () => {
    const r = drawTeams(mk([5, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 0]), 2, 6, 10);
    expect(r.next).toBeUndefined();
    expect(rerollStarters(r, 999).next).toBeUndefined();
  });

  it('starterSeeds diferentes eventualmente dão próximos diferentes', () => {
    const r = drawTeams(pool4, 4, 5, 10);
    const base = rerollStarters(r, 0).next;
    let differ = false;
    for (let s = 1; s < 50; s++) {
      if (rerollStarters(r, s).next !== base) {
        differ = true;
        break;
      }
    }
    expect(differ).toBe(true);
  });
});

describe('validFormats', () => {
  it('sugere 4x5 sem sobra para 20 confirmados', () => {
    const f = validFormats(20);
    expect(f[0]).toEqual({ numTeams: 4, perTeam: 5, leftover: 0 });
    expect(f).toContainEqual({ numTeams: 3, perTeam: 6, leftover: 2 });
  });

  it('não sugere formato que não cabe', () => {
    expect(validFormats(9)).toEqual([]);
  });
});
