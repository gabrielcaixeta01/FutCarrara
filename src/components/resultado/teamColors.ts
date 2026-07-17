import type { SelecaoName } from '@/lib/teams';

/**
 * Cor por seleção. Strings de classe completas (Tailwind não gera classes
 * montadas dinamicamente). A cor viaja junto do nome — Brasil é sempre amarelo,
 * mesmo quando cai no time 3. O Record garante (em compile-time) uma cor por
 * seleção listada em lib/teams.ts.
 */
type ColorSet = {
  dot: string;
  text: string;
  border: string;
  soft: string;
};

const COLORS: Record<SelecaoName, ColorSet> = {
  Brasil: { dot: 'bg-amber-400', text: 'text-amber-300', border: 'border-amber-500/40', soft: 'bg-amber-500/10' },
  Argentina: { dot: 'bg-sky-400', text: 'text-sky-300', border: 'border-sky-500/40', soft: 'bg-sky-500/10' },
  França: { dot: 'bg-blue-400', text: 'text-blue-300', border: 'border-blue-500/40', soft: 'bg-blue-500/10' },
  Espanha: { dot: 'bg-rose-400', text: 'text-rose-300', border: 'border-rose-500/40', soft: 'bg-rose-500/10' },
  Holanda: { dot: 'bg-orange-400', text: 'text-orange-300', border: 'border-orange-500/40', soft: 'bg-orange-500/10' },
  Portugal: { dot: 'bg-emerald-400', text: 'text-emerald-300', border: 'border-emerald-500/40', soft: 'bg-emerald-500/10' },
  Alemanha: { dot: 'bg-zinc-400', text: 'text-zinc-300', border: 'border-zinc-500/40', soft: 'bg-zinc-500/10' },
  Itália: { dot: 'bg-cyan-400', text: 'text-cyan-300', border: 'border-cyan-500/40', soft: 'bg-cyan-500/10' },
};

export function selecaoColor(name: SelecaoName): ColorSet {
  return COLORS[name];
}
