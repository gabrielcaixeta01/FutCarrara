export type Skill = 0 | 1 | 2 | 3 | 4 | 5;

export interface Player {
  id: string;
  name: string;
  skill: Skill;
  /** Jogador saiu do grupo. Some da UI sem quebrar sorteios antigos. */
  active: boolean;
  /** Visitante do sorteio de hoje. Só UI/estado de tela; não persiste no elenco. */
  guest?: true;
}

export interface Group {
  id: string;
  name: string;
  players: Player[];
}

/** Um time já sorteado, pronto pra exibição. */
export interface Team {
  players: Player[];
  /** Soma dos skills. Usada pra balancear. */
  total: number;
  /** Média dos skills, arredondada a 2 casas. */
  avg: number;
}

export interface DrawResult {
  teams: Team[];
  seed: number;
  /** max(total) - min(total). 0 = perfeito. */
  spread: number;
  /** Índices dos 2 times que começam. Só quando numTeams >= 3. */
  starters?: [number, number];
  /** Seed usada para sortear os starters. Presente sempre que starters existir. */
  starterSeed?: number;
}

/** Jogador congelado no momento do sorteio. Snapshot, não referência. */
export interface DrawPlayer {
  id: string;
  name: string;
  skill: Skill;
  guest?: true;
}

/**
 * Sorteio persistido no histórico.
 *
 * Um sorteio passado é um fato imutável: guarda um snapshot dos jogadores,
 * não ids. Assim ele não quebra se alguém sai do elenco depois, nem depende
 * de visitantes que nunca estiveram nele.
 */
export interface Draw {
  id: string;
  groupId: string;
  createdAt: number;
  seed: number;
  starterSeed?: number;
  numTeams: number;
  perTeam: number;
  /** Snapshot dos jogadores por time — congelado no momento do sorteio. */
  teams: DrawPlayer[][];
  starters?: [number, number];
}

/** Arranjo possível para N confirmados. */
export interface Format {
  numTeams: number;
  perTeam: number;
  leftover: number;
}

export const PER_TEAM_OPTIONS = [5, 6, 7] as const;
export const NUM_TEAMS_OPTIONS = [2, 3, 4] as const;
