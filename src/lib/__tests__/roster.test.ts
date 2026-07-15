import { describe, it, expect } from 'vitest';
import { ROSTER, GROUP_NAME } from '../roster';

/**
 * O elenco é editado à mão no código. Estes testes são a rede de segurança
 * contra os erros que dá pra cometer editando: id repetido (React embaralha
 * linhas), skill fora do domínio, nome vazio.
 */
describe('ROSTER', () => {
  it('não está vazio', () => {
    expect(ROSTER.length).toBeGreaterThan(0);
  });

  it('tem ids únicos', () => {
    const ids = ROSTER.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('não gera id vazio', () => {
    for (const p of ROSTER) expect(p.id).not.toBe('');
  });

  it('tem nomes não vazios', () => {
    for (const p of ROSTER) expect(p.name.trim()).not.toBe('');
  });

  it('só tem skill de 0 a 5 em passos de 0.5', () => {
    for (const p of ROSTER) {
      expect(p.skill).toBeGreaterThanOrEqual(0);
      expect(p.skill).toBeLessThanOrEqual(5);
      expect(p.skill * 2).toBe(Math.trunc(p.skill * 2));
    }
  });

  it('tem alguém ativo pra sortear', () => {
    expect(ROSTER.some((p) => p.active)).toBe(true);
  });

  it('tem nome de grupo', () => {
    expect(GROUP_NAME.trim()).not.toBe('');
  });
});
