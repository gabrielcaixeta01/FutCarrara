import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface HighlightStat {
  label: string;
  value: string;
}

export interface HighlightPlayer {
  id: string;
  name: string;
  role: string;
  rating: number;
  club: string;
  foot: string;
  image?: string;
  imageAlt?: string;
  pace: number;
  shot: number;
  pass: number;
  dribble: number;
  defense: number;
  physical: number;
  accent: string;
}

interface Props {
  player: HighlightPlayer;
}

export function HighlightCard({ player }: Props) {
  const stats: HighlightStat[] = [
    { label: 'PAC', value: String(player.pace) },
    { label: 'SHO', value: String(player.shot) },
    { label: 'PAS', value: String(player.pass) },
    { label: 'DRI', value: String(player.dribble) },
    { label: 'DEF', value: String(player.defense) },
    { label: 'PHY', value: String(player.physical) },
  ];

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-[2.15rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(255,255,255,0.06))] p-3 shadow-[0_24px_90px_-34px_rgba(0,0,0,0.95)]',
        player.accent,
      )}
    >
      <div className="absolute inset-0 opacity-90" />
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.28),transparent_58%)]" />
      <div className="absolute inset-x-[-15%] top-[18%] h-40 rotate-[-10deg] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.11),transparent_60%)] blur-2xl" />

      <div className="relative z-10 flex h-full min-h-[640px] flex-col rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,14,0.12),rgba(12,18,14,0.58))] p-4 backdrop-blur-sm">
        <header className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.32em] text-ink/80">
              FUT HERO
            </p>
            <p className="mt-1 text-[0.68rem] uppercase tracking-[0.22em] text-ink-soft">
              {player.club}
            </p>
          </div>

          <div className="text-right">
            <span className="block font-display text-[4.35rem] leading-[0.8] text-ink">
              {player.rating}
            </span>
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-ink-soft">
              Overall
            </span>
          </div>
        </header>

        <div className="mt-4 flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <span className="inline-flex min-w-[4.5rem] items-center justify-center rounded-[1rem] border border-white/15 bg-white/10 px-3 py-2 text-center font-display text-2xl leading-none text-ink">
              {player.role}
            </span>
            <span className="inline-flex min-w-[4.5rem] items-center justify-center rounded-[1rem] border border-white/15 bg-white/10 px-3 py-2 text-center text-[0.62rem] font-bold uppercase tracking-[0.28em] text-ink">
              {player.foot} foot
            </span>
          </div>

          <div className="relative mt-4 flex flex-1 items-end justify-center overflow-hidden rounded-[1.7rem] border border-white/10 bg-[radial-gradient(circle_at_50%_26%,rgba(255,255,255,0.15),transparent_56%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.38))]">
            <div className="absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent)]" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,rgba(0,0,0,0.48),transparent)]" />
            {player.image ? (
              <Image
                src={player.image}
                alt={player.imageAlt ?? player.name}
                fill
                className="object-contain object-bottom p-2"
              />
            ) : (
              <div className="relative z-10 flex h-full min-h-[250px] w-full items-end justify-center p-4">
                <span className="rounded-full border border-white/15 bg-black/28 px-4 py-2 text-center text-[0.62rem] font-bold uppercase tracking-[0.28em] text-ink-soft backdrop-blur-sm">
                  imagem pendente
                </span>
              </div>
            )}

            <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/28 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-ink backdrop-blur-sm">
              Destaque
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-2xl uppercase leading-none tracking-tight text-ink drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]">
                  {player.name}
                </p>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.28em] text-ink-soft">
                  {player.club}
                </p>
              </div>
              <div className="rounded-[1rem] border border-white/15 bg-black/28 px-3 py-2 text-right backdrop-blur-sm">
                <span className="block text-[0.62rem] font-bold uppercase tracking-[0.3em] text-ink-soft">
                  Liga
                </span>
                <span className="block font-display text-lg uppercase leading-none text-ink">
                  Fut Carrara
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-black/16 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-ink-soft">
                    {stat.label}
                  </span>
                  <span className="font-display text-lg leading-none text-ink">
                    {stat.value}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-flood),var(--color-grass-soft))]"
                    style={{ width: `${Number(stat.value)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}