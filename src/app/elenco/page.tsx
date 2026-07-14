'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Users } from 'lucide-react';
import type { Player, Skill } from '@/types';
import { useGroup } from '@/hooks/useGroup';
import { LEVELS_DESC, levelName, levelOf, type Level } from '@/lib/levels';
import { AddPlayerForm } from '@/components/elenco/AddPlayerForm';
import { PlayerRow } from '@/components/elenco/PlayerRow';
import { Filters, type StatusFilter } from '@/components/elenco/Filters';
import { LevelGroupHeader } from '@/components/ui/LevelGroupHeader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

/** Normaliza pra busca: sem acento, minúsculo. "José" casa com "jose". */
function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/** Ativos primeiro, depois alfabético. */
const byActiveThenName = (a: Player, b: Player) =>
  Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, 'pt-BR');

/** Dentro do grupo: ativos primeiro, skill desc, depois nome. */
const byActiveThenSkillThenName = (a: Player, b: Player) =>
  Number(b.active) - Number(a.active) ||
  b.skill - a.skill ||
  a.name.localeCompare(b.name, 'pt-BR');

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
  const [levels, setLevels] = useState<Set<Level>>(new Set());
  const [status, setStatus] = useState<StatusFilter>('all');
  const [pendingRemoval, setPendingRemoval] = useState<Player | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const activeCount = players.filter((p) => p.active).length;
  const searching = query.trim() !== '';
  const anyFilter = levels.size > 0 || status !== 'all';

  // Nome + status (sem nível): base para a contagem dos chips.
  const base = useMemo(() => {
    const q = norm(query);
    return players.filter((p) => {
      const okName = q ? norm(p.name).includes(q) : true;
      const okStatus =
        status === 'all' ? true : status === 'active' ? p.active : !p.active;
      return okName && okStatus;
    });
  }, [players, query, status]);

  // Conta por nível base (4.0 e 4.5 caem juntos em "Craque").
  const levelCounts = useMemo(() => {
    const counts: Record<Level, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const p of base) counts[levelOf(p.skill)]++;
    return counts;
  }, [base]);

  const filtered = useMemo(
    () => (levels.size ? base.filter((p) => levels.has(levelOf(p.skill))) : base),
    [base, levels],
  );

  const flat = useMemo(() => [...filtered].sort(byActiveThenName), [filtered]);

  // Seis grupos por nível base; dentro, skill desc depois nome.
  const groups = useMemo(
    () =>
      LEVELS_DESC.map((level) => ({
        level,
        players: filtered
          .filter((p) => levelOf(p.skill) === level)
          .sort(byActiveThenSkillThenName),
      })).filter((g) => g.players.length > 0),
    [filtered],
  );

  function toggleLevel(level: Level) {
    setLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  }

  function clearFilters() {
    setLevels(new Set());
    setStatus('all');
  }

  const rowHandlers = (p: Player) => ({
    onSkill: (skill: Skill) => updatePlayer(p.id, { skill }),
    onToggle: () => toggleActive(p.id),
    onRemove: () => setPendingRemoval(p),
  });

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

      {!loading && players.length > 0 && (
        <div className="px-4 pt-4">
          <Filters
            levelCounts={levelCounts}
            selectedLevels={levels}
            onToggleLevel={toggleLevel}
            status={status}
            onStatus={setStatus}
            anyActive={anyFilter}
            onClear={clearFilters}
          />
        </div>
      )}

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
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">
            {searching
              ? `Ninguém com “${query.trim()}” nesses filtros.`
              : 'Nenhum jogador com esses filtros.'}
          </p>
        ) : searching ? (
          <ul className="space-y-2">
            {flat.map((p) => (
              <PlayerRow key={p.id} player={p} {...rowHandlers(p)} />
            ))}
          </ul>
        ) : (
          <div className="space-y-5">
            {groups.map((g) => (
              <div key={g.level} className="space-y-2">
                <LevelGroupHeader
                  label={levelName(g.level)}
                  count={g.players.length}
                />
                <ul className="space-y-2">
                  {g.players.map((p) => (
                    <PlayerRow key={p.id} player={p} {...rowHandlers(p)} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
