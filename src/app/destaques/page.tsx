import Link from 'next/link';
import { ChevronLeft, Shield, Sparkles } from 'lucide-react';
import { HighlightCard, type HighlightPlayer } from '@/components/destaques/HighlightCard';

const HIGHLIGHT_PLAYERS: HighlightPlayer[] = [
  {
    id: 'destaque-1',
    name: 'Carrara',
    role: 'ST',
    rating: 91,
    club: 'Fut Carrara FC',
    foot: 'R',
    image: '/CarraraDitador.png',
    imageAlt: 'Carrara em uniforme militar',
    pace: 93,
    shot: 92,
    pass: 84,
    dribble: 90,
    defense: 42,
    physical: 81,
    accent: 'from-amber-300/35 via-orange-400/10 to-pink-500/15',
  },
  {
    id: 'destaque-2',
    name: 'Cauê',
    role: 'CAM',
    rating: 89,
    club: 'Fut Carrara FC',
    foot: 'L',
    image: '/CaueDitador.png',
    imageAlt: 'Cauê em uniforme militar',
    pace: 85,
    shot: 88,
    pass: 93,
    dribble: 92,
    defense: 50,
    physical: 74,
    accent: 'from-sky-300/35 via-cyan-400/10 to-emerald-400/15',
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

          <div className="inline-flex items-center gap-2 rounded-full border border-grass/25 bg-grass/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-grass-soft">
            <Sparkles className="size-4" />
            Cartas estilo FIFA
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-grass-soft">
            Jogadores destaque
          </p>
          <h1 className="font-display text-4xl uppercase leading-none tracking-tight text-ink">
            Moldura pronta para os craques
          </h1>
          <p className="max-w-sm text-sm text-ink-soft">
            A tela já nasce com a estrutura visual das cartas. Depois você só troca a imagem e os números de cada jogador.
          </p>
        </div>
      </header>

      <section className="mt-6 grid gap-4">
        {HIGHLIGHT_PLAYERS.map((player) => (
          <HighlightCard key={player.id} player={player} />
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-pitch-soft px-4 py-4 text-sm text-ink-soft">
        <div className="flex items-center gap-2 text-ink">
          <Shield className="size-4 text-grass-soft" />
          <span className="font-bold uppercase tracking-[0.24em] text-xs">Próximo passo</span>
        </div>
        <p className="mt-2 leading-relaxed">
          Quando você mandar as imagens e as estatísticas definitivas, eu planto cada carta com os dados reais sem mudar a estrutura.
        </p>
      </section>
    </main>
  );
}