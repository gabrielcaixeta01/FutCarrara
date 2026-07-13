'use client';

import { useState, type RefObject } from 'react';
import { Plus } from 'lucide-react';
import type { Skill } from '@/types';
import { SkillSelect } from './SkillSelect';

interface Props {
  onAdd: (name: string, skill: Skill) => void;
  nameRef: RefObject<HTMLInputElement | null>;
}

/** Formulário de adição. Mantém o foco no nome pra cadastrar em série. */
export function AddPlayerForm({ onAdd, nameRef }: Props) {
  const [name, setName] = useState('');
  const [skill, setSkill] = useState<Skill>(3);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, skill);
    setName('');
    // Nível fica "grudado" — cadastrar vários do mesmo nível é comum.
    nameRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        ref={nameRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do jogador"
        autoComplete="off"
        className="h-12 w-full rounded-xl border border-line bg-pitch-soft px-4 text-base text-slate-100 placeholder:text-slate-500 focus:border-grass focus:outline-none focus-visible:ring-2 focus-visible:ring-grass"
      />
      <div className="flex items-center gap-3">
        <SkillSelect
          value={skill}
          onChange={setSkill}
          ariaLabel="Nível do novo jogador"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-grass px-4 font-semibold text-pitch transition-colors hover:bg-grass-soft disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-grass-soft"
        >
          <Plus className="size-5" />
          Adicionar
        </button>
      </div>
    </form>
  );
}
