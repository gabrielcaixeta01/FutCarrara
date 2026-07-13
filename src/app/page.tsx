import Link from 'next/link';
import { Users, Shuffle } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-8 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-grass-soft">
          Fut Carrara
        </h1>
        <p className="text-sm text-slate-400">
          Marque quem chegou e sorteie times equilibrados em segundos.
        </p>
      </header>

      <nav className="grid gap-3">
        <Link
          href="/elenco"
          className="flex items-center gap-4 rounded-2xl border border-line bg-pitch-soft px-5 py-4 transition-colors hover:border-grass"
        >
          <Users className="size-6 shrink-0 text-grass-soft" />
          <span className="flex flex-col">
            <span className="font-semibold">Elenco</span>
            <span className="text-sm text-slate-400">
              Cadastre e ajuste o nível dos jogadores.
            </span>
          </span>
        </Link>

        <Link
          href="/sorteio"
          className="flex items-center gap-4 rounded-2xl border border-line bg-pitch-soft px-5 py-4 transition-colors hover:border-grass"
        >
          <Shuffle className="size-6 shrink-0 text-grass-soft" />
          <span className="flex flex-col">
            <span className="font-semibold">Sorteio</span>
            <span className="text-sm text-slate-400">
              Confirme os presentes e monte os times de hoje.
            </span>
          </span>
        </Link>
      </nav>
    </main>
  );
}
