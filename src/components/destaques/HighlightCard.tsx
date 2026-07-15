import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface HighlightStat {
  label: string;
  value: string;
}

export type HighlightTier = 'bronze' | 'silver' | 'gold' | 'icon' | 'totw' | 'goat';

export interface HighlightPlayer {
  id: string;
  name: string;
  role: string;
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
  /** Versões especiais declaradas à mão. Sem tier, a régua do rating decide. */
  tier?: 'icon' | 'totw' | 'goat';
}

interface Props {
  player: HighlightPlayer;
}

/** Silhueta da carta: cantos chanfrados, no espírito das cartas do Ultimate Team. */
const CARD_SHAPE =
  'polygon(9% 0, 91% 0, 100% 4.5%, 100% 91%, 89% 100%, 11% 100%, 0 91%, 0 4.5%)';

/** Rating = média simples dos seis atributos: mexeu no stat, o overall acompanha. */
export function ratingOf(player: HighlightPlayer): number {
  const sum =
    player.pace +
    player.shot +
    player.pass +
    player.dribble +
    player.defense +
    player.physical;
  return Math.round(sum / 6);
}

/** Régua do FIFA: bronze até 64, prata até 74, ouro dali pra cima. */
function tierOf(player: HighlightPlayer, rating: number): HighlightTier {
  if (player.tier) return player.tier;
  if (rating <= 64) return 'bronze';
  if (rating <= 74) return 'silver';
  return 'gold';
}

interface TierStyle {
  /** Moldura: wrapper com o mesmo clip-path e um padding fino — o gradiente
      metálico aparece só na fresta e acompanha o chanfro, coisa que border não faz. */
  frame: string;
  /** Luz de cima + escuro assentando embaixo. */
  depth: string;
  /** Véu no canto superior esquerdo, garante contraste do bloco de identidade
      independente do formato da figurinha. */
  veil: string;
  /** Brilho que atravessa a carta no scroll (ver globals.css). */
  sheen: string;
  primary: string;
  secondary: string;
  muted: string;
  line: string;
}

/* Tiers comuns compartilham o texto claro sobre fundo escuro; só a moldura muda. */
const ON_DARK = {
  depth:
    'bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.22),transparent_55%),linear-gradient(180deg,transparent_45%,rgba(4,10,7,0.72))]',
  veil: 'bg-[radial-gradient(ellipse_at_top_left,rgba(4,10,7,0.82),transparent_70%)]',
  sheen: 'bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)]',
  primary: 'text-ink drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]',
  secondary: 'text-ink/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]',
  muted: 'text-ink-soft drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]',
  line: 'bg-ink/20',
};

const DROP = 'drop-shadow-[0_14px_28px_rgba(0,0,0,0.55)]';

const TIERS: Record<HighlightTier, TierStyle> = {
  bronze: {
    ...ON_DARK,
    frame: `bg-[linear-gradient(165deg,#c08850,#5e3c1e_36%,#96662f_60%,#472d14)] ${DROP}`,
  },
  silver: {
    ...ON_DARK,
    frame: `bg-[linear-gradient(165deg,#eceff1,#82878c_36%,#c6cbd0_60%,#565b60)] ${DROP}`,
  },
  gold: {
    ...ON_DARK,
    frame: `bg-[linear-gradient(165deg,#f6e5a4,#96772f_36%,#dcbd60_60%,#6b5320)] ${DROP}`,
  },
  /* Ídolo do FIFA: carta creme, texto em dourado escuro — a única de fundo claro. */
  icon: {
    frame: `bg-[linear-gradient(160deg,#f7e7ae,#b08c34_30%,#e3c76f_55%,#7d5f20_80%,#d4b862)] ${DROP}`,
    depth:
      'bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.5),transparent_55%),linear-gradient(180deg,transparent_45%,rgba(146,116,52,0.28))]',
    veil: 'bg-[radial-gradient(ellipse_at_top_left,rgba(247,240,222,0.9),transparent_70%)]',
    sheen: 'bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)]',
    primary: 'text-[#4a3a14] drop-shadow-[0_1px_2px_rgba(255,252,240,0.7)]',
    secondary: 'text-[#5f4d1e] drop-shadow-[0_1px_2px_rgba(255,252,240,0.6)]',
    muted: 'text-[#8a7440]',
    line: 'bg-[#4a3a14]/25',
  },
  /* In-Form (TOTW): a versão especial da carta base — preta com detalhes dourados. */
  totw: {
    frame: `bg-[linear-gradient(165deg,#caa244,#57430f_36%,#9a7b2e_60%,#3c2e0c)] ${DROP}`,
    depth:
      'bg-[radial-gradient(circle_at_50%_0%,rgba(238,201,92,0.16),transparent_55%),linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.78))]',
    veil: 'bg-[radial-gradient(ellipse_at_top_left,rgba(4,10,7,0.82),transparent_70%)]',
    sheen: 'bg-[linear-gradient(90deg,transparent,rgba(238,201,92,0.22),transparent)]',
    primary: 'text-[#eec95c] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]',
    secondary: 'text-[#d9b44e] drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]',
    muted: 'text-[#a8873a] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]',
    line: 'bg-[#eec95c]/25',
  },
  /* A carta do dono: preta e dourada, com brilho e glow que nenhuma outra tem. */
  goat: {
    frame: `bg-[linear-gradient(160deg,#fff4c8,#c9a43c_28%,#f8e192_52%,#8a6d24_78%,#ecd27c)] drop-shadow-[0_14px_36px_rgba(226,190,94,0.35)]`,
    depth:
      'bg-[radial-gradient(circle_at_50%_0%,rgba(248,225,146,0.24),transparent_55%),linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.75))]',
    veil: 'bg-[radial-gradient(ellipse_at_top_left,rgba(4,10,7,0.82),transparent_70%)]',
    sheen: 'bg-[linear-gradient(90deg,transparent,rgba(255,231,157,0.34),transparent)]',
    primary: 'text-[#f8e7ad] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]',
    secondary: 'text-[#e5cd85] drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]',
    muted: 'text-[#cdb268] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]',
    line: 'bg-[#f8e7ad]/25',
  },
};

export function HighlightCard({ player }: Props) {
  const rating = ratingOf(player);
  const tier = TIERS[tierOf(player, rating)];

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
    /* @container: os tamanhos internos usam cqw, então a carta escala inteira
       como uma imagem em qualquer largura de coluna. */
    <div className="@container">
      <div
        className={cn('aspect-63/88 p-[max(2px,0.8cqw)]', tier.frame)}
        style={{ clipPath: CARD_SHAPE }}
      >
        <article
          className={cn(
            'highlight-card relative isolate h-full overflow-hidden bg-linear-to-b',
            player.accent,
          )}
          style={{ clipPath: CARD_SHAPE }}
        >
          <div className={cn('absolute inset-0', tier.depth)} />

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
                sizes="(max-width: 768px) 80vw, 420px"
                className="object-contain object-bottom drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]"
              />
            ) : (
              <div className="flex h-full items-end justify-center pb-2">
                <span
                  className={cn(
                    'text-[max(0.5rem,2.3cqw)] font-bold uppercase tracking-[0.28em]',
                    tier.muted,
                  )}
                >
                  imagem pendente
                </span>
              </div>
            )}
          </div>

          <div
            className={cn(
              'pointer-events-none absolute left-0 top-0 h-[48%] w-[42%]',
              tier.veil,
            )}
          />

          <div
            className={cn(
              'highlight-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/2',
              tier.sheen,
            )}
          />

          <div className="relative z-10 flex h-full flex-col px-[max(0.8rem,5.8cqw)] pt-[max(0.65rem,4.8cqw)] pb-[max(1rem,7.7cqw)]">
            {/* Bloco de identidade, canto superior esquerdo — a assinatura da carta FIFA. */}
            <header className="flex flex-col items-center self-start">
              <span
                className={cn(
                  'font-display text-[max(1.7rem,13cqw)] leading-[0.78] tracking-tight',
                  tier.primary,
                )}
              >
                {rating}
              </span>
              <span
                className={cn(
                  'font-display text-[max(0.75rem,4.8cqw)] uppercase leading-none tracking-[0.08em]',
                  tier.secondary,
                )}
              >
                {player.role}
              </span>
              <span
                className={cn('my-[max(0.25rem,1.4cqw)] h-px w-[max(1rem,6.7cqw)]', tier.line)}
              />
              <span
                className={cn(
                  'text-[max(0.5rem,2.2cqw)] font-bold uppercase tracking-[0.2em]',
                  tier.muted,
                )}
              >
                {player.foot}
              </span>
            </header>

            <div className="flex-1" />

            <p
              className={cn(
                'text-center font-display text-[max(0.85rem,5.8cqw)] uppercase leading-none tracking-tight',
                tier.primary,
              )}
            >
              {player.name}
            </p>

            <div
              className={cn('mt-[max(0.5rem,2.9cqw)] mb-[max(0.4rem,2.4cqw)] h-px', tier.line)}
            />

            <div className="relative grid grid-flow-col grid-cols-2 grid-rows-3 gap-x-[max(0.6rem,4.8cqw)] gap-y-[max(0.2rem,1.4cqw)] px-[1cqw]">
              {/* Divisor central entre as colunas de stats, como na carta original. */}
              <span className={cn('absolute inset-y-0 left-1/2 w-px', tier.line)} />
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-[max(0.3rem,1.9cqw)]">
                  <span
                    className={cn(
                      'min-w-[max(1.1rem,7.7cqw)] text-right font-display text-[max(0.75rem,4.8cqw)] leading-none',
                      tier.primary,
                    )}
                  >
                    {stat.value}
                  </span>
                  <span
                    className={cn(
                      'text-[max(0.5rem,2.3cqw)] font-bold uppercase tracking-[0.18em]',
                      tier.muted,
                    )}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
