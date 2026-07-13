'use client';

import { cn } from '@/lib/utils';

interface Props {
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
}

/** Switch de ativo/inativo. Alvo de toque grande (56×32). */
export function Toggle({ checked, onChange, ariaLabel }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={cn(
        'relative h-8 w-14 shrink-0 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-grass',
        checked ? 'border-grass bg-grass/30' : 'border-line bg-pitch-soft',
      )}
    >
      <span
        className={cn(
          'absolute top-1 size-6 rounded-full transition-all',
          checked ? 'left-7 bg-grass' : 'left-1 bg-slate-500',
        )}
      />
    </button>
  );
}
