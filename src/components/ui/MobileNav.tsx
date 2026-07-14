'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Shuffle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/elenco', label: 'Elenco', icon: Users },
  { href: '/sorteio', label: 'Sorteio', icon: Shuffle },
  { href: '/resultado', label: 'Resultado', icon: Trophy },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto max-w-md px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <nav className="grid grid-cols-4 overflow-hidden rounded-t-3xl border border-b-0 border-line bg-pitch/95 shadow-[0_-12px_32px_rgba(0,0,0,0.35)] backdrop-blur">
          {ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-2 py-3 text-[11px] font-medium transition-colors',
                  active
                    ? 'bg-grass/10 text-grass-soft'
                    : 'text-slate-400 hover:bg-pitch-soft hover:text-slate-100',
                )}
              >
                <Icon className="size-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}