import Link from 'next/link';
import { ArrowRight, Shuffle, Star, Users, type LucideIcon } from 'lucide-react';
import { HomeTagline } from '@/components/home/HomeTagline';
import { MounjaroEasterEgg } from '@/components/ui/MounjaroEasterEgg';

export default function HomePage() {
  return (
    <main className="relative mx-auto flex min-h-dvh max-w-md flex-col px-6 pt-16">
      <MounjaroEasterEgg />
      {/* Assinatura: risca do meio-campo + círculo central, bem sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-88 overflow-hidden opacity-[0.13]"
      >
        <svg
          viewBox="0 0 400 400"
          className="absolute left-1/2 -top-28 w-[135%] -translate-x-1/2 text-grass"
        >
          <circle cx="200" cy="200" r="118" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="200" cy="200" r="4" fill="currentColor" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <header className="team-reveal space-y-4">
        <h1 className="font-display text-[4.25rem] uppercase leading-[0.82] tracking-tight text-ink">
          Fut
          <br />
          Carrara
        </h1>
        <HomeTagline />
      </header>

      {/* Herói: sortear é o motivo do app existir, então ocupa o palco sozinho.
          É o único bloco verde-cheio do app — o resto da página fica quieto. */}
      <div className="team-reveal mt-10" style={{ animationDelay: '90ms' }}>
        <Link
          href="/sorteio"
          className="group relative block overflow-hidden rounded-3xl bg-linear-to-br from-grass to-grass-deep p-6 text-pitch transition-all active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-grass-soft focus-visible:ring-offset-2 focus-visible:ring-offset-pitch"
        >
          {/* Meio-campo como marca d'água, cortado pela borda do card */}
          <svg
            aria-hidden
            viewBox="0 0 200 200"
            className="pointer-events-none absolute -bottom-16 -right-10 size-48 opacity-[0.14]"
          >
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="100" cy="100" r="3" fill="currentColor" />
            <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="3" />
          </svg>

          <div className="flex items-start justify-between">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-pitch text-grass">
              <Shuffle className="size-6" strokeWidth={2.5} />
            </span>
            <ArrowRight className="size-6 transition-transform group-hover:translate-x-1" />
          </div>

          <span className="mt-6 block font-display text-5xl uppercase leading-[0.9] tracking-tight">
            Tirar
            <br />
            times
          </span>
          <p className="mt-3 max-w-52 text-sm font-semibold leading-snug text-pitch/80">
            Marca quem veio. O sorteio faz o resto.
          </p>
        </Link>
      </div>

      <nav className="mt-3 grid grid-cols-2 gap-3">
        <div className="team-reveal" style={{ animationDelay: '170ms' }}>
          <SecondaryCard
            href="/elenco"
            icon={Users}
            title="Elenco"
            desc="Quem é quem no grupo."
          />
        </div>
        <div className="team-reveal" style={{ animationDelay: '240ms' }}>
          <SecondaryCard
            href="/destaques"
            icon={Star}
            title="Cartas"
            desc="Os mitos da pelada."
          />
        </div>
      </nav>
    </main>
  );
}

function SecondaryCard({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-line bg-pitch-soft p-4 transition-colors hover:border-grass/50 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-grass"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-pitch-raised text-grass-soft">
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block font-display text-lg uppercase tracking-wide text-ink">
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-ink-soft">{desc}</span>
      </span>
    </Link>
  );
}
