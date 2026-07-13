export type Skill = 0 | 1 | 2 | 3 | 4 | 5;

export interface Player {
  id: string;
  name: string;
  skill: Skill;
  /** Jogador saiu do grupo. Some da UI sem quebrar sorteios antigos. */
  active: boolean;
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

/** Sorteio persistido no histórico. */
export interface Draw {
  id: string;
  groupId: string;
  createdAt: number;
  seed: number;
  numTeams: number;
  perTeam: number;
  /** playerIds por time. Referência, não cópia. */
  teams: string[][];
  starters?: [number, number];
  /** Seed usada para sortear os starters. */
  starterSeed?: number;
}

/** Arranjo possível para N confirmados. */
export interface Format {
  numTeams: number;
  perTeam: number;
  leftover: number;
}

export const PER_TEAM_OPTIONS = [5, 6, 7] as const;
export const NUM_TEAMS_OPTIONS = [2, 3, 4] as const;
