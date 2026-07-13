/**
 * Algoritmo de sorteio e balanceamento de times.
 *
 * REGRA: este arquivo não importa nada. Funções puras, determinísticas
 * dada a seed. Ver CLAUDE.md → "Regras invioláveis".
 */
import type { Player, DrawResult, Format } from '@/types';

/** PRNG determinístico. Mesma seed → mesma sequência. */
export function mulberry32(seed: number): () => number {
  // TODO
  throw new Error('not implemented');
}

/** Fisher-Yates com RNG injetado. Não muta o array de entrada. */
export function shuffle<T>(arr: readonly T[], rng: () => number): T[] {
  // TODO
  throw new Error('not implemented');
}

/**
 * Sorteia times equilibrados.
 * Lança se `pool.length !== numTeams * perTeam`.
 *
 * 1. snake draft sobre o pool embaralhado
 * 2. local search (~2000 swaps), aceita se reduzir o custo
 * 3. custo = spread * 100 + média do desvio-padrão interno
 */
export function drawTeams(
  pool: readonly Player[],
  numTeams: number,
  perTeam: number,
  seed?: number,
): DrawResult {
  // TODO
  throw new Error('not implemented');
}

/** Sorteia os 2 times que começam. Só faz sentido com numTeams >= 3. */
export function pickStarters(numTeams: number, seed: number): [number, number] {
  // TODO
  throw new Error('not implemented');
}

/**
 * Arranjos possíveis para N confirmados.
 * Ordenado por menor sobra, depois por mais times.
 * Ex.: validFormats(20) → [{4,5,0}, {3,6,2}, {2,7,6}, ...]
 */
export function validFormats(n: number): Format[] {
  // TODO
  throw new Error('not implemented');
}
