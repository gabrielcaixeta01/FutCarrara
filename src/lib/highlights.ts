/**
 * As cartas da tela de destaques. Lista estática editada à mão no código,
 * no mesmo espírito do `roster.ts` — adicionar cartinha nova é adicionar
 * uma entrada aqui (e a figurinha em /public, em webp).
 *
 * O rating NÃO é declarado: é a média dos seis atributos (`ratingOf`).
 * Mexeu num stat, o overall e o tier da moldura acompanham sozinhos.
 */

export interface HighlightPlayer {
  id: string;
  name: string;
  role: string;
  foot: string;
  image?: string;
  imageAlt?: string;
  pace: number;
  shot: number;
  pass: number;
  dribble: number;
  defense: number;
  physical: number;
  /** Gradiente de fundo da carta (classes from/via/to do Tailwind). */
  accent: string;
  /** Versões especiais declaradas à mão. Sem tier, a régua do rating decide
      (bronze até 64, prata até 74, ouro dali pra cima — ver HighlightCard). */
  tier?: 'icon' | 'totw' | 'goat';
}

/** Rating = média simples dos seis atributos, arredondada. */
export function ratingOf(player: HighlightPlayer): number {
  const sum =
    player.pace +
    player.shot +
    player.pass +
    player.dribble +
    player.defense +
    player.physical;
  return Math.round(sum / 6);
}

export const HIGHLIGHTS: HighlightPlayer[] = [
  {
    id: 'destaque-caixeta',
    name: 'Caixeta',
    role: 'GOAT',
    foot: 'R',
    image: '/Caixeta.webp',
    imageAlt: 'Caixeta, a lenda do grupo',
    pace: 99,
    shot: 99,
    pass: 99,
    dribble: 99,
    defense: 97,
    physical: 99,
    accent: 'from-[#39301a] via-[#14100a] to-black',
    tier: 'goat',
  },
  {
    id: 'destaque-1',
    name: 'Carrara Ditador',
    role: 'ST',
    foot: 'R',
    image: '/CarraraDitador.webp',
    imageAlt: 'Carrara em uniforme militar',
    pace: 77,
    shot: 92,
    pass: 75,
    dribble: 30,
    defense: 55,
    physical: 79,
    accent: 'from-[#fbf5e4] via-[#f0e3c2] to-[#cfae72]',
    tier: 'icon',
  },
  {
    id: 'destaque-2',
    name: 'Aquino',
    role: 'Error',
    foot: 'R',
    image: '/Aquino.webp',
    imageAlt: 'Aquino magro.',
    pace: 2,
    shot: 77,
    pass: 56,
    dribble: 3,
    defense: 40,
    physical: 32,
    accent: 'from-orange-300/45 via-amber-700/22 to-stone-900/40',
  },
  {
    id: 'destaque-3',
    name: 'Aquino Ressaca',
    role: 'MEI',
    foot: 'R',
    image: '/AquinoRessaca.webp',
    imageAlt: 'Aquino Ressaca',
    pace: 60,
    shot: 88,
    pass: 65,
    dribble: 21,
    defense: 40,
    physical: 12,
    accent: 'from-[#26241d] via-[#171512] to-[#070605]',
    tier: 'totw',
  },
  {
    id: 'destaque-4',
    name: 'Nenzim',
    role: 'VOL',
    foot: 'R',
    image: '/Nenzim.webp',
    imageAlt: 'Nenzim.',
    pace: 85,
    shot: 70,
    pass: 89,
    dribble: 85,
    defense: 78,
    physical: 79,
    accent: 'from-yellow-100/55 via-amber-400/18 to-orange-950/35',
  },
  {
    id: 'destaque-5',
    name: 'Safaad',
    role: 'ZAG',
    foot: 'R',
    image: '/Safaad.webp',
    imageAlt: 'Safaad.',
    pace: 75,
    shot: 10,
    pass: 89,
    dribble: 88,
    defense: 91,
    physical: 78,
    accent: 'from-slate-100/50 via-sky-400/16 to-indigo-950/38',
  },
  {
    id: 'destaque-6',
    name: 'Cauê Ditador',
    role: 'CAM',
    foot: 'R',
    image: '/CaueDitador.webp',
    imageAlt: 'Cauê em uniforme militar',
    pace: 75,
    shot: 70,
    pass: 89,
    dribble: 85,
    defense: 78,
    physical: 77,
    accent: 'from-stone-200/45 via-lime-900/22 to-green-950/40',
  },
];
