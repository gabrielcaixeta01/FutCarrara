import { describe, it, expect } from 'vitest';
import { HIGHLIGHTS, ratingOf, type HighlightPlayer } from '../highlights';

/**
 * As cartas são editadas à mão, como o elenco. Rede de segurança contra id
 * repetido e atributo fora de 0–99; e prova de que o overall é derivado (média
 * dos seis stats), não declarado.
 */
describe('ratingOf', () => {
  it('é a média dos seis atributos, arredondada', () => {
    const p: HighlightPlayer = {
      id: 't',
      name: 'Teste',
      role: 'ST',
      foot: 'R',
      pace: 80,
      shot: 80,
      pass: 80,
      dribble: 80,
      defense: 80,
      physical: 80,
      accent: '',
    };
    expect(ratingOf(p)).toBe(80); // 480/6 = 80
    expect(ratingOf({ ...p, defense: 74 })).toBe(79); // 474/6 = 79 exato
    expect(ratingOf({ ...p, defense: 72 })).toBe(79); // 472/6 = 78.67 → 79 (pra cima)
    expect(ratingOf({ ...p, defense: 71 })).toBe(79); // 471/6 = 78.5 → 79 (meio pra cima)
  });
});

describe('HIGHLIGHTS', () => {
  it('não está vazio', () => {
    expect(HIGHLIGHTS.length).toBeGreaterThan(0);
  });

  it('tem ids únicos', () => {
    const ids = HIGHLIGHTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('tem atributos dentro de 0–99', () => {
    for (const p of HIGHLIGHTS) {
      for (const stat of [p.pace, p.shot, p.pass, p.dribble, p.defense, p.physical]) {
        expect(stat).toBeGreaterThanOrEqual(0);
        expect(stat).toBeLessThanOrEqual(99);
      }
    }
  });
});
