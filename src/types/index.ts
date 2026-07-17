export type Skill =
  | 0
  | 0.5
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 4.5
  | 5;

/** Todos os valores de skill, do mais alto pro mais baixo. */
export const SKILL_VALUES: Skill[] = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0];

export interface Player {
  id: string;
  name: string;
  skill: Skill;
  /** Aposentado: continua no elenco, mas não aparece no sorteio. */
  active: boolean;
  /** Visitante do sorteio de hoje. Só estado de tela; não existe no elenco. */
  guest?: true;
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
  /** Índice do próximo time a entrar — o 3º da mesma ordem que define os starters. */
  next?: number;
  /** Seed usada para sortear os starters. Presente sempre que starters existir. */
  starterSeed?: number;
}

/** Arranjo possível para N confirmados. */
export interface Format {
  numTeams: number;
  perTeam: number;
  leftover: number;
}
