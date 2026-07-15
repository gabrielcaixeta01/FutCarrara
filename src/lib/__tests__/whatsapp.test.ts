import { describe, it, expect } from 'vitest';
import { formatForWhatsApp } from '../whatsapp';
import type { DrawResult, Team, Player, Skill } from '@/types';

const player = (name: string, skill: Skill, guest?: true): Player => ({
  id: name,
  name,
  skill,
  active: true,
  ...(guest ? { guest } : {}),
});

const team = (players: Player[]): Team => {
  const total = players.reduce((s, p) => s + p.skill, 0);
  return {
    players,
    total,
    avg: Math.round((total / players.length) * 100) / 100,
  };
};

const result = (
  teams: Team[],
  starters?: [number, number],
  next?: number,
): DrawResult => ({
  teams,
  seed: 1,
  spread: 0,
  ...(starters ? { starters } : {}),
  ...(next !== undefined ? { next } : {}),
});

describe('formatForWhatsApp', () => {
  it('gera o formato exato', () => {
    const r = result([
      team([player('Ana', 3), player('Bruno', 3)]),
      team([player('Carla', 3), player('Diego', 3)]),
    ]);
    expect(formatForWhatsApp(r, 'Futebol Carrara')).toBe(
      [
        '⚽ FUTEBOL CARRARA',
        '',
        '🟦 TIME 1',
        'Ana, Bruno',
        '',
        '🟥 TIME 2',
        'Carla, Diego',
      ].join('\n'),
    );
  });

  it('não vaza skill, soma nem média', () => {
    // skills 5 → soma 10, média 5. Nada disso pode aparecer.
    const r = result([
      team([player('Ana', 5), player('Bruno', 5)]),
      team([player('Carla', 5), player('Diego', 5)]),
    ]);
    const text = formatForWhatsApp(r, 'Futebol Carrara');
    expect(text).not.toMatch(/soma|m[ée]dia/i);
    expect(text).not.toContain('10');
    expect(text).not.toContain('5');
  });

  it('marca visitante', () => {
    const r = result([
      team([player('Ana', 3), player('Zé', 3, true)]),
      team([player('Carla', 3), player('Diego', 3)]),
    ]);
    const text = formatForWhatsApp(r, 'Futebol Carrara');
    expect(text).toContain('Zé (visitante)');
    expect(text).not.toContain('Ana (visitante)');
  });

  it('inclui a linha de quem começa com 3+ times', () => {
    const r = result(
      [
        team([player('A', 3)]),
        team([player('B', 3)]),
        team([player('C', 3)]),
      ],
      [0, 2],
    );
    expect(formatForWhatsApp(r, 'Grupo')).toContain(
      '▶️ Começam: Time 1 x Time 3',
    );
  });

  it('omite a linha de quem começa com 2 times', () => {
    const r = result([team([player('A', 3)]), team([player('B', 3)])]);
    expect(formatForWhatsApp(r, 'Grupo')).not.toMatch(/Começam/);
  });

  it('inclui o próximo a entrar logo abaixo de quem começa', () => {
    const r = result(
      [
        team([player('A', 3)]),
        team([player('B', 3)]),
        team([player('C', 3)]),
        team([player('D', 3)]),
      ],
      [1, 2],
      3,
    );
    expect(formatForWhatsApp(r, 'Grupo')).toContain(
      ['▶️ Começam: Time 2 x Time 3', '⏭️ Próximo: Time 4'].join('\n'),
    );
  });

  it('omite o próximo quando não há', () => {
    const r = result([team([player('A', 3)]), team([player('B', 3)])]);
    expect(formatForWhatsApp(r, 'Grupo')).not.toMatch(/Próximo/);
  });

  it('nunca vaza nível nem média', () => {
    const r = result(
      [team([player('A', 5), player('B', 4.5)]), team([player('C', 3)])],
      [0, 1],
      1,
    );
    const text = formatForWhatsApp(r, 'Grupo');
    expect(text).not.toMatch(/média|Monstro|4\.5|9\.5/i);
  });
});
