'use client';

import { useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import type { Player } from '@/types';
import { useGroup } from '@/hooks/useGroup';
import { LEVELS_DESC, levelName, levelOf, type Level } from '@/lib/levels';
import { PlayerRow } from '@/components/elenco/PlayerRow';
import { Filters, type StatusFilter } from '@/components/elenco/Filters';
import { LevelGroupHeader } from '@/components/ui/LevelGroupHeader';
import { SearchField } from '@/components/ui/SearchField';

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
  const { players, loading } = useGroup();

  const [query, setQuery] = useState('');
  const [levels, setLevels] = useState<Set<Level>>(new Set());
  const [status, setStatus] = useState<StatusFilter>('active');

  const activeCount = players.filter((p) => p.active).length;
  const searching = query.trim() !== '';
  const anyFilter = levels.size > 0 || status !== 'active';

  // Nome + status (sem nível): base para a contagem dos chips.
  const base = useMemo(() => {
    const q = norm(query);
    return players.filter((p) => {
      const okName = q ? norm(p.name).includes(q) : true;
      const okStatus = status === 'active' ? p.active : !p.active;
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
    setStatus('active');
  }

  return (
    <main className="mx-auto min-h-dvh max-w-md pb-28 sm:pb-16">
      <header className="sticky top-0 z-20 space-y-4 border-b border-line/70 bg-pitch/85 px-4 pb-4 pt-6 backdrop-blur-xl">
        <div className="flex items-end justify-between gap-3">
          <h1 className="font-display text-4xl uppercase leading-none tracking-tight text-ink">
            Elenco
          </h1>
          {!loading && players.length > 0 && (
            <span className="rounded-full border border-line bg-pitch-soft px-3 py-1 text-xs font-medium text-ink-soft">
              <span className="font-bold text-grass-soft">{activeCount}</span> de{' '}
              {players.length}
            </span>
          )}
        </div>

        <SearchField value={query} onChange={setQuery} />
      </header>

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
                Cadastre jogadores pelo código e volte aqui para visualizar.
              </p>
            </div>
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
              <PlayerRow key={p.id} player={p} />
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
                    <PlayerRow key={p.id} player={p} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
