/**
 * O elenco. Fonte única de verdade, editada só aqui no código.
 *
 * O app NÃO edita elenco: a tela /elenco é de leitura e não existe persistência
 * de jogador. Pra mudar nível, aposentar alguém ou adicionar gente nova, mexa
 * na lista abaixo e faça deploy. Ver CLAUDE.md → "Fora de escopo".
 *
 * - `skill`: 0–5 em passos de 0.5. Ver o glossário no CLAUDE.md.
 * - `active: false` = aposentado. Fica no elenco, some do sorteio.
 */
import type { Player, Skill } from '@/types';

/** Nome do grupo. Vai no cabeçalho do texto do WhatsApp. */
export const GROUP_NAME = 'Futebol Carrara';

/**
 * id estável derivado do nome: "Carrara Irmão" → "carrara-irmao".
 * Estável importa: é a key do React e o id que o sorteio carrega. Nome novo =
 * id novo, e isso é aceitável porque nada guarda id entre sessões.
 */
function slug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const PLAYERS: Array<{ name: string; skill: Skill; active: boolean }> = [
  { name: 'Thiago M', skill: 5, active: true },
  { name: 'Jaques', skill: 5, active: true },
  { name: 'Luis H', skill: 5, active: true },
  { name: 'Diego', skill: 5, active: true },
  { name: 'Hansen', skill: 5, active: false },
  { name: 'Carrara', skill: 4.5, active: true },
  { name: 'Caland', skill: 4.5, active: true },
  { name: 'Érico', skill: 4.5, active: true },
  { name: 'PZ', skill: 4.5, active: true },
  { name: 'Caixeta', skill: 4.5, active: true },
  { name: 'Nenzin', skill: 4.5, active: true },
  { name: 'Léo', skill: 4.5, active: true },
  { name: 'JP', skill: 4.5, active: true },
  { name: 'Cauê', skill: 4, active: true },
  { name: 'Saad', skill: 4, active: true },
  { name: 'Paim', skill: 4, active: true },
  { name: 'PH', skill: 4, active: false },
  { name: 'Igor', skill: 4, active: true },
  { name: 'Bolt', skill: 4, active: true },
  { name: 'Lyra', skill: 4, active: true },
  { name: 'Joao M', skill: 3.5, active: true },
  { name: 'Dp', skill: 3.5, active: true },
  { name: 'Tom', skill: 3.5, active: true },
  { name: 'GB', skill: 3.5, active: true },
  { name: 'Carone', skill: 3.5, active: true },
  { name: 'Portugal', skill: 3.5, active: true },
  { name: 'Paulo Ricco', skill: 3, active: true },
  { name: 'Guilherme Galo', skill: 3, active: true },
  { name: 'Pedro Andrade', skill: 3, active: true },
  { name: 'Adriano', skill: 3, active: true },
  { name: 'Serra', skill: 3, active: true },
  { name: 'Nicholas', skill: 3, active: true },
  { name: 'Trento', skill: 3, active: true },
  { name: 'Diegordo', skill: 3, active: false },
  { name: 'Titcho', skill: 2.5, active: true },
  { name: 'Max', skill: 2.5, active: true },
  { name: 'Marcelo', skill: 2.5, active: true },
  { name: 'Carrara Pai', skill: 2, active: false },
  { name: 'Felipe Fidalgo', skill: 2, active: true },
  { name: 'Dan', skill: 2, active: true },
  { name: 'Carrara Irmão', skill: 2, active: false },
  { name: 'Lucas Aquino', skill: 1.5, active: true },
  { name: 'Vitor Mello', skill: 1, active: true },
  { name: 'Rafael Aquino', skill: 1, active: true },
  { name: 'Paulo Bluetooth', skill: 1, active: true },
  { name: 'Enzo Pompeu', skill: 0, active: false },
];

export const ROSTER: readonly Player[] = PLAYERS.map((p) => ({
  id: slug(p.name),
  name: p.name,
  skill: p.skill,
  active: p.active,
}));
