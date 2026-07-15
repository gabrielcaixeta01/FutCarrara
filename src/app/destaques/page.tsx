import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { HighlightCard } from '@/components/destaques/HighlightCard';
import { HIGHLIGHTS } from '@/lib/highlights';

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

      {/* Duas colunas no celular: carta inteira cabe na tela, como a vitrine do clube no FIFA. */}
      <section className="mt-6 grid grid-cols-2 gap-3">
        {HIGHLIGHTS.map((player) => (
          <HighlightCard key={player.id} player={player} />
        ))}
      </section>
    </main>
  );
}
