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

/** Silhueta da carta: cantos chanfrados, no espírito das cartas do Ultimate Team. */
const CARD_SHAPE =
  'polygon(9% 0, 91% 0, 100% 4.5%, 100% 91%, 89% 100%, 11% 100%, 0 91%, 0 4.5%)';

export function HighlightCard({ player }: Props) {
  // A FIFA lê as stats em coluna: PAC/SHO/PAS na esquerda, DRI/DEF/PHY na direita.
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
        'highlight-card relative isolate aspect-63/88 overflow-hidden bg-linear-to-b shadow-[0_24px_90px_-34px_rgba(0,0,0,0.95)]',
        player.accent,
      )}
      style={{ clipPath: CARD_SHAPE }}
    >
      {/* Profundidade: luz vinda de cima, escuro assentando embaixo. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.22),transparent_55%),linear-gradient(180deg,transparent_45%,rgba(4,10,7,0.72))]" />

      {/* Recorte do jogador: sangra na carta, sem moldura. As figurinhas têm
          contorno branco e terminam num corte reto — a máscara dissolve essa
          borda no fundo em vez de deixar a linha aparecendo. */}
      <div
        className="absolute inset-x-0 top-0 bottom-[36%] pl-[24%]"
        style={{
          maskImage: 'linear-gradient(to bottom, black 74%, transparent 98%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 74%, transparent 98%)',
        }}
      >
        {player.image ? (
          <Image
            src={player.image}
            alt={player.imageAlt ?? player.name}
            fill
            sizes="(max-width: 768px) 90vw, 420px"
            className="object-contain object-bottom drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]"
          />
        ) : (
          <div className="flex h-full items-end justify-center pb-2">
            <span className="text-[0.58rem] font-bold uppercase tracking-[0.28em] text-ink-soft">
              imagem pendente
            </span>
          </div>
        )}
      </div>

      {/* Véu no canto superior esquerdo. As figurinhas variam muito de formato — as
          mais largas passam por baixo do bloco de identidade e o contorno branco
          apaga o texto. Isso garante contraste independente da imagem. */}
      <div className="pointer-events-none absolute left-0 top-0 h-56 w-44 bg-[radial-gradient(ellipse_at_top_left,rgba(4,10,7,0.82),transparent_70%)]" />

      {/* Brilho metálico atravessando a carta, guiado pelo scroll (ver globals.css). */}
      <div className="highlight-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)]" />

      <div className="relative z-10 flex h-full flex-col px-6 pt-5 pb-8">
        {/* Bloco de identidade, canto superior esquerdo — a assinatura da carta FIFA. */}
        <header className="flex flex-col items-center self-start">
          <span className="font-display text-[3.4rem] leading-[0.78] tracking-tight text-ink drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {player.rating}
          </span>
          <span className="font-display text-xl uppercase leading-none tracking-[0.08em] text-ink/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
            {player.role}
          </span>
          <span className="my-1.5 h-px w-7 bg-ink/25" />
          <span className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-ink/75 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            {player.foot}
          </span>
        </header>

        <div className="flex-1" />

        <p className="text-center font-display text-2xl uppercase leading-none tracking-tight text-ink drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)]">
          {player.name}
        </p>

        <div className="mt-3 mb-2.5 h-px bg-ink/20" />

        <div className="grid grid-flow-col grid-cols-2 grid-rows-3 gap-x-5 gap-y-1.5 px-1">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className="min-w-8 text-right font-display text-xl leading-none text-ink">
                {stat.value}
              </span>
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-ink-soft">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
