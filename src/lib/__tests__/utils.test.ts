import { describe, it, expect } from 'vitest';
import { normalizeText } from '../utils';

/**
 * normalizeText é a base da busca do elenco/sorteio e do slug do roster.
 * O caso que mais importa é o acento: se ele parar de ser removido, "José"
 * some quando alguém digita "jose". A regex de marcas combinantes vive aqui.
 */
describe('normalizeText', () => {
  it('remove acento', () => {
    expect(normalizeText('José')).toBe('jose');
    expect(normalizeText('Sérgio')).toBe('sergio');
    expect(normalizeText('Ção')).toBe('cao');
  });

  it('minúsculo e sem espaço nas pontas', () => {
    expect(normalizeText('  CARRARA  ')).toBe('carrara');
  });

  it('deixa texto sem acento intacto', () => {
    expect(normalizeText('diego')).toBe('diego');
  });
});
