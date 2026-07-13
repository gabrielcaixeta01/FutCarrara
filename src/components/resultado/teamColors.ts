/**
 * Cor por time. Strings de classe completas (Tailwind não gera classes
 * montadas dinamicamente). Índice = número do time - 1. Máx. 4 times.
 * A ordem casa com os emojis em lib/whatsapp.ts (azul, vermelho, amarelo, roxo).
 */
export const TEAM_COLORS = [
  { dot: 'bg-sky-400', text: 'text-sky-300', border: 'border-sky-500/40' },
  { dot: 'bg-rose-400', text: 'text-rose-300', border: 'border-rose-500/40' },
  { dot: 'bg-amber-400', text: 'text-amber-300', border: 'border-amber-500/40' },
  {
    dot: 'bg-violet-400',
    text: 'text-violet-300',
    border: 'border-violet-500/40',
  },
] as const;

export function teamColor(index: number) {
  return TEAM_COLORS[index % TEAM_COLORS.length]!;
}
