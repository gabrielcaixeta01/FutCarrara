'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';

interface Props {
  onAdd: (name: string) => void;
}

/** Botão "+ Visitante" que abre um input pra cadastrar visitantes em série. */
export function GuestAdder({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName('');
    inputRef.current?.focus();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line font-medium text-slate-300 transition-colors hover:border-grass hover:text-grass-soft"
      >
        <Plus className="size-5" />
        Visitante
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do visitante"
        autoComplete="off"
        className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-pitch-soft px-4 text-base text-slate-100 placeholder:text-slate-500 focus:border-grass focus:outline-none focus-visible:ring-2 focus-visible:ring-grass"
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="flex h-12 shrink-0 items-center gap-1 rounded-xl bg-grass px-4 font-semibold text-pitch transition-colors hover:bg-grass-soft disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="size-5" />
        Add
      </button>
      <button
        type="button"
        aria-label="Fechar"
        onClick={() => {
          setOpen(false);
          setName('');
        }}
        className="flex size-12 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-pitch-soft hover:text-slate-100"
      >
        <X className="size-5" />
      </button>
    </form>
  );
}
