import { describe, it, expect } from 'vitest';
import { teamSelecoes, SELECOES } from '../teams';

/**
 * teamSelecoes é o contrato que faz a tela de resultado e o texto do WhatsApp
 * baterem: dada a mesma seed, os mesmos times recebem as mesmas seleções.
 * Se isso quebrar, a tela diz "Brasil" e o WhatsApp diz "Argentina".
 */
describe('teamSelecoes', () => {
  it('devolve exatamente `count` seleções', () => {
    for (const count of [2, 3, 4]) {
      expect(teamSelecoes(123, count)).toHaveLength(count);
    }
  });

  it('é determinístico para a mesma seed', () => {
    expect(teamSelecoes(42, 4)).toEqual(teamSelecoes(42, 4));
  });

  it('não repete seleção dentro do mesmo sorteio', () => {
    const names = teamSelecoes(7, 4).map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('seeds diferentes eventualmente dão seleções diferentes', () => {
    const base = teamSelecoes(0, 4).map((s) => s.name).join();
    let differs = false;
    for (let seed = 1; seed < 50; seed++) {
      if (teamSelecoes(seed, 4).map((s) => s.name).join() !== base) {
        differs = true;
        break;
      }
    }
    expect(differs).toBe(true);
  });

  it('só devolve seleções da lista canônica', () => {
    const known = new Set(SELECOES.map((s) => s.name));
    for (const s of teamSelecoes(999, 4)) expect(known.has(s.name)).toBe(true);
  });
});
