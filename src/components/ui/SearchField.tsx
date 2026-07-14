'use client';

import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

/** Campo de busca por nome, padronizado entre as telas. */
export function SearchField({
  value,
  onChange,
  placeholder = 'Buscar por nome',
  ariaLabel = 'Buscar por nome',
}: Props) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-ink-soft" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-12 w-full rounded-2xl border border-line bg-pitch-soft/70 pl-11 pr-4 text-base text-ink placeholder:text-ink-soft/70 focus:border-grass focus:outline-none focus-visible:ring-2 focus-visible:ring-grass/50"
      />
    </div>
  );
}
