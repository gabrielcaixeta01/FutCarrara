import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { HighlightCard, type HighlightPlayer } from '@/components/destaques/HighlightCard';

const HIGHLIGHT_PLAYERS: HighlightPlayer[] = [
  {
    id: 'destaque-1',
    name: 'Carrara Ditador',
    role: 'ST',
    rating: 88,
    foot: 'R',
    image: '/CarraraDitador.png',
    imageAlt: 'Carrara em uniforme militar',
    pace: 77,
    shot: 92,
    pass: 75,
    dribble: 30,
    defense: 55,
    physical: 79,
    accent: 'from-amber-100/60 via-rose-400/18 to-purple-950/35',
  },
  {
    id: 'destaque-2',
    name: 'Aquino',
    role: 'Error',
    rating: 22,
    foot: 'R',
    image: '/Aquino.png',
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
    rating: 75,
    foot: 'R',
    image: '/AquinoRessaca.png',
    imageAlt: 'Aquino Ressaca',
    pace: 60,
    shot: 88,
    pass: 65,
    dribble: 21,
    defense: 40,
    physical: 12,
    accent: 'from-lime-200/45 via-yellow-600/16 to-emerald-950/35',
  },
  {
    id: 'destaque-4',
    name: 'Nenzim',
    role: 'VOL',
    rating: 82,
    foot: 'R',
    image: '/Nenzim.png',
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
    rating: 83,
    foot: 'R',
    image: '/Safaad.png',
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
    rating: 82,
    foot: 'R',
    image: '/CaueDitador.png',
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

export default function DestaquesPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-md px-4 pb-28 pt-6 sm:pb-16">
      <header className="space-y-4 border-b border-line/70 pb-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-pitch-soft px-3.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
          >
            <ChevronLeft className="size-4" />
            Voltar
          </Link>

        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-grass-soft">
            Jogadores destaque
          </p>
          <h1 className="font-display text-4xl uppercase leading-none tracking-tight text-ink">
            Craques que marcaram a história do grupo
          </h1>
          <p className="max-w-sm text-sm text-ink-soft">
            Marcaram positivamente ou negativamente kkkk
          </p>
        </div>
      </header>

      <section className="mt-6 grid gap-4">
        {HIGHLIGHT_PLAYERS.map((player) => (
          <HighlightCard key={player.id} player={player} />
        ))}
      </section>
    </main>
  );
}