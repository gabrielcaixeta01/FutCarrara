'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Users } from 'lucide-react';
import type { Player } from '@/types';
import { useGroup } from '@/hooks/useGroup';
import { AddPlayerForm } from '@/components/elenco/AddPlayerForm';
import { PlayerRow } from '@/components/elenco/PlayerRow';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

/** Normaliza pra busca: sem acento, minúsculo. "José" casa com "jose". */
function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export default function ElencoPage() {
  const {
    players,
    addPlayer,
    updatePlayer,
    removePlayer,
    toggleActive,
    loading,
  } = useGroup();

  const [query, setQuery] = useState('');
  const [pendingRemoval, setPendingRemoval] = useState<Player | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const activeCount = players.filter((p) => p.active).length;

  // Filtra por nome; ativos primeiro, alfabético dentro de cada grupo.
  const visible = useMemo(() => {
    const q = norm(query);
    return players
      .filter((p) => (q ? norm(p.name).includes(q) : true))
      .sort(
        (a, b) =>
          Number(b.active) - Number(a.active) ||
          a.name.localeCompare(b.name, 'pt-BR'),
      );
  }, [players, query]);

  return (
    <main className="mx-auto min-h-dvh max-w-md pb-16">
      <header className="sticky top-0 z-10 space-y-3 border-b border-line bg-pitch/95 px-4 pb-3 pt-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Voltar"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-pitch-soft hover:text-slate-100"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="flex-1 text-xl font-bold tracking-tight text-grass-soft">
            Elenco
          </h1>
          {!loading && players.length > 0 && (
            <span className="text-sm text-slate-400">
              <span className="font-semibold text-slate-100">{activeCount}</span>{' '}
              ativos de {players.length}
            </span>
          )}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome"
            aria-label="Buscar jogador por nome"
            className="h-12 w-full rounded-xl border border-line bg-pitch-soft pl-10 pr-4 text-base text-slate-100 placeholder:text-slate-500 focus:border-grass focus:outline-none focus-visible:ring-2 focus-visible:ring-grass"
          />
        </div>
      </header>

      <div className="px-4 pt-4">
        <AddPlayerForm onAdd={addPlayer} nameRef={nameRef} />
      </div>

      <div className="px-4 pt-4">
        {loading ? (
          <p className="py-16 text-center text-sm text-slate-500">
            Carregando elenco…
          </p>
        ) : players.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line px-6 py-12 text-center">
            <Users className="size-10 text-slate-600" />
            <div className="space-y-1">
              <p className="font-medium text-slate-200">Elenco vazio</p>
              <p className="text-sm text-slate-500">
                Cadastre o primeiro jogador para começar a montar os times.
              </p>
            </div>
            <button
              type="button"
              onClick={() => nameRef.current?.focus()}
              className="h-11 rounded-xl bg-grass px-5 font-semibold text-pitch transition-colors hover:bg-grass-soft"
            >
              Adicionar jogador
            </button>
          </div>
        ) : visible.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">
            Ninguém com “{query.trim()}” no elenco.
          </p>
        ) : (
          <ul className="space-y-2">
            {visible.map((p) => (
              <PlayerRow
                key={p.id}
                player={p}
                onSkill={(skill) => updatePlayer(p.id, { skill })}
                onToggle={() => toggleActive(p.id)}
                onRemove={() => setPendingRemoval(p)}
              />
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={pendingRemoval !== null}
        title="Remover jogador"
        message={
          pendingRemoval
            ? `Remover ${pendingRemoval.name} do elenco? Essa ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Remover"
        onConfirm={() => {
          if (pendingRemoval) removePlayer(pendingRemoval.id);
          setPendingRemoval(null);
        }}
        onCancel={() => setPendingRemoval(null)}
      />
    </main>
  );
}
