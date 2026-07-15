import Link from 'next/link';
import {
  ChevronRight,
  Shuffle,
  Star,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MounjaroEasterEgg } from '@/components/ui/MounjaroEasterEgg';

export default function HomePage() {
  return (
    <main className="relative mx-auto flex min-h-dvh max-w-md flex-col px-6 pt-20">
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

      <header className="space-y-4">
        <h1 className="font-display text-[4.25rem] uppercase leading-[0.82] tracking-tight text-ink">
          Fut
          <br />
          Carrara
        </h1>
        <p className="max-w-xs text-sm text-ink-soft">
          Fim da Panelinha do Carrara.
        </p>
      </header>

      <nav className="mt-12 space-y-3">
        <HomeCard
          href="/sorteio"
          icon={Shuffle}
          title="Sortear times"
          desc="Escolha os presentes e monte os times."
          accent
        />
        <HomeCard
          href="/elenco"
          icon={Users}
          title="Elenco"
          desc="Veja o grupo e os níveis."
        />
        <HomeCard
          href="/destaques"
          icon={Star}
          title="Jogadores Destaque"
          desc="Veja as cartas dos principais nomes."
          accent
        />
      </nav>

    </main>
  );
}

function HomeCard({
  href,
  icon: Icon,
  title,
  desc,
  accent,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center gap-4 rounded-2xl border p-5 transition-all active:scale-[0.99]',
        accent
          ? 'border-grass/40 bg-grass/10 hover:border-grass'
          : 'border-line bg-pitch-soft hover:border-grass/50',
      )}
    >
      <span
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-xl',
          accent ? 'bg-grass text-pitch' : 'bg-pitch-raised text-grass-soft',
        )}
      >
        <Icon className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg uppercase tracking-wide text-ink">
          {title}
        </span>
        <span className="block text-sm text-ink-soft">{desc}</span>
      </span>
      <ChevronRight className="size-5 shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
