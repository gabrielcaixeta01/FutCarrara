/**
 * Algoritmo de sorteio e balanceamento de times.
 *
 * REGRA: este arquivo não importa nada além de tipos. Funções puras,
 * determinísticas dada a seed. Ver CLAUDE.md → "Regras invioláveis".
 */
import type { Player, Team, DrawResult, Format } from '@/types';

// Inline em vez de importar de types (aquilo seria import de valor, não tipo).
const PER_TEAM: readonly number[] = [5, 6, 7];
const NUM_TEAMS: readonly number[] = [2, 3, 4];

/** PRNG determinístico. Mesma seed → mesma sequência. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates com RNG injetado. Não muta o array de entrada. */
export function shuffle<T>(arr: readonly T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

function sum(players: readonly Player[]): number {
  let s = 0;
  for (const p of players) s += p.skill;
  return s;
}

/** Desvio-padrão populacional dos skills de um time. */
function stdDev(players: readonly Player[]): number {
  if (players.length === 0) return 0;
  const mean = sum(players) / players.length;
  let acc = 0;
  for (const p of players) acc += (p.skill - mean) ** 2;
  return Math.sqrt(acc / players.length);
}

function spreadOf(groups: readonly Player[][]): number {
  let min = Infinity;
  let max = -Infinity;
  for (const g of groups) {
    const t = sum(g);
    if (t < min) min = t;
    if (t > max) max = t;
  }
  return max - min;
}

/** Custo: spread domina; desvio interno médio é só desempate. */
function cost(groups: readonly Player[][]): number {
  let stdAcc = 0;
  for (const g of groups) stdAcc += stdDev(g);
  return spreadOf(groups) * 100 + stdAcc / groups.length;
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
  if (pool.length !== numTeams * perTeam) {
    throw new Error(
      `Conta não fecha: ${pool.length} jogadores para ${numTeams}×${perTeam}.`,
    );
  }

  const s = seed ?? 0;
  const rng = mulberry32(s);

  // Embaralha primeiro (desempate aleatório), depois ordena por skill desc.
  // Sort estável → mantém a ordem embaralhada entre skills iguais.
  const ordered = shuffle(pool, rng).sort((a, b) => b.skill - a.skill);

  // Snake draft.
  const groups: Player[][] = Array.from({ length: numTeams }, () => []);
  for (let i = 0; i < ordered.length; i++) {
    const round = Math.floor(i / numTeams);
    const pos = i % numTeams;
    const team = round % 2 === 0 ? pos : numTeams - 1 - pos;
    groups[team]!.push(ordered[i]!);
  }

  // Local search: troca dois jogadores entre times, aceita se reduz custo.
  let current = cost(groups);
  for (let k = 0; k < 2000; k++) {
    const ta = Math.floor(rng() * numTeams);
    let tb = Math.floor(rng() * numTeams);
    if (ta === tb) tb = (tb + 1) % numTeams;

    const i = Math.floor(rng() * perTeam);
    const j = Math.floor(rng() * perTeam);

    const ga = groups[ta]!;
    const gb = groups[tb]!;
    const tmp = ga[i]!;
    ga[i] = gb[j]!;
    gb[j] = tmp;

    const next = cost(groups);
    if (next < current) {
      current = next;
    } else {
      // reverte
      const back = ga[i]!;
      ga[i] = gb[j]!;
      gb[j] = back;
    }
  }

  // Monta os Team, embaralhando a ordem interna pra não vazar o ranking.
  const teams: Team[] = groups.map((g) => {
    const players = shuffle(g, rng);
    const total = sum(players);
    return {
      players,
      total,
      avg: Math.round((total / players.length) * 100) / 100,
    };
  });

  const result: DrawResult = {
    teams,
    seed: s,
    spread: spreadOf(groups),
  };

  if (numTeams >= 3) {
    result.starters = pickStarters(numTeams, s);
  }

  return result;
}

/** Sorteia os 2 times que começam. Só faz sentido com numTeams >= 3. */
export function pickStarters(numTeams: number, seed: number): [number, number] {
  const rng = mulberry32(seed);
  const order = shuffle(
    Array.from({ length: numTeams }, (_, i) => i),
    rng,
  );
  return [order[0]!, order[1]!];
}

/**
 * Arranjos possíveis para N confirmados.
 * Ordenado por menor sobra, depois por mais times.
 * Ex.: validFormats(20) → [{4,5,0}, {3,6,2}, {2,7,6}, ...]
 */
export function validFormats(n: number): Format[] {
  const out: Format[] = [];
  for (const numTeams of NUM_TEAMS) {
    for (const perTeam of PER_TEAM) {
      const need = numTeams * perTeam;
      if (need <= n) {
        out.push({ numTeams, perTeam, leftover: n - need });
      }
    }
  }
  out.sort((a, b) => a.leftover - b.leftover || b.numTeams - a.numTeams);
  return out;
}
