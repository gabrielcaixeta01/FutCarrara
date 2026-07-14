'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Shuffle, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/elenco', label: 'Elenco', icon: Users },
  { href: '/sorteio', label: 'Sorteio', icon: Shuffle },
  { href: '/resultado', label: 'Times', icon: Trophy },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto max-w-md px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <nav className="pointer-events-auto flex items-center gap-1 rounded-[1.75rem] border border-line/70 bg-pitch-soft/85 p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          {ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 rounded-[1.4rem] py-2.5 text-[10px] font-bold uppercase tracking-wide transition-all duration-200',
                  active
                    ? 'bg-grass text-pitch shadow-[0_6px_18px_-4px_rgba(34,197,94,0.6)]'
                    : 'text-ink-soft hover:text-ink',
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
