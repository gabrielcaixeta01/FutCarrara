/**
 * Identidade dos times: seleções da Copa. É puro flavor — o time é só um grupo
 * balanceado, e a seleção é um apelido sorteado. Quais seleções entram (e em
 * qual time) sai de um embaralhamento DETERMINÍSTICO pela seed do sorteio:
 *
 * - mesma seed  → mesmas seleções (tela e WhatsApp sempre batem);
 * - reroll de quem começa NÃO muda a seed → os times mantêm a seleção;
 * - só um sorteio novo (seed nova) troca as seleções.
 *
 * As cores de cada seleção vivem em components/resultado/teamColors.ts,
 * indexadas por nome (o TypeScript exige uma cor por seleção).
 */
import { mulberry32, shuffle } from './balance';

export const SELECOES = [
  { name: 'Brasil', flag: '🇧🇷' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'França', flag: '🇫🇷' },
  { name: 'Espanha', flag: '🇪🇸' },
  { name: 'Holanda', flag: '🇳🇱' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Alemanha', flag: '🇩🇪' },
  { name: 'Itália', flag: '🇮🇹' },
] as const;

export type Selecao = (typeof SELECOES)[number];
export type SelecaoName = Selecao['name'];

/**
 * Seleções dos times `0..count-1`, sorteadas pela seed. Distintas entre si.
 * A constante do XOR só desacopla essa sequência de outros usos da mesma seed
 * (times e starters usam outras).
 */
export function teamSelecoes(seed: number, count: number): Selecao[] {
  const rng = mulberry32((seed ^ 0x5f356495) >>> 0);
  return shuffle(SELECOES, rng).slice(0, count);
}
