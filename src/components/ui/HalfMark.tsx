import { cn } from '@/lib/utils';

/** Marcador discreto de meio nível: ▲ = meio ponto acima do nível base. */
export function HalfMark({ className }: { className?: string }) {
  return (
    <span
      aria-label="meio nível acima"
      title="meio nível acima"
      className={cn('text-slate-400', className)}
    >
      ▲
    </span>
  );
}
