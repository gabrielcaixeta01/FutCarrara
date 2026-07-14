'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import type { Draw, DrawPlayer, Format, Player, Skill } from '@/types';
import { useGroup } from '@/hooks/useGroup';
import { drawTeams, validFormats } from '@/lib/balance';
import { saveDraw, saveLastResult } from '@/lib/storage';
import { uid } from '@/lib/utils';
import { LEVELS_DESC, levelName } from '@/lib/levels';
import { PlayerTile } from '@/components/sorteio/PlayerTile';
import { LevelGroupHeader } from '@/components/ui/LevelGroupHeader';
import { GuestAdder } from '@/components/sorteio/GuestAdder';
import { GuestCard } from '@/components/sorteio/GuestCard';
import { SortearFooter } from '@/components/sorteio/SortearFooter';

function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export default function SorteioPage() {
  const { group, players, loading } = useGroup();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [guests, setGuests] = useState<Player[]>([]);

  const activePlayers = useMemo(
    () => players.filter((p) => p.active),
    [players],
  );
  const activeById = useMemo(
    () => new Map(activePlayers.map((p) => [p.id, p])),
    [activePlayers],
  );

  // Só ids ainda ativos entram na seleção efetiva.
  const selectedElenco = useMemo(
    () =>
      selectedIds
        .map((id) => activeById.get(id))
        .filter((p): p is Player => p !== undefined),
    [selectedIds, activeById],
  );

  // Visitantes contam como selecionados enquanto existirem.
  const pool = useMemo(
    () => [...selectedElenco, ...guests],
    [selectedElenco, guests],
  );
  const count = pool.length;

  const selectedSet = useMemo(
    () => new Set(selectedElenco.map((p) => p.id)),
    [selectedElenco],
  );

  const searching = query.trim() !== '';

  // Busca ativa: lista achatada (sem headers). Ordena por nome.
  const visible = useMemo(() => {
    const q = norm(query);
    return activePlayers
      .filter((p) => (q ? norm(p.name).includes(q) : true))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [activePlayers, query]);

  // Sem busca: agrupa por nível, do mais alto pro mais baixo. Grupos vazios somem.
  const groups = useMemo(
    () =>
      LEVELS_DESC.map((skill) => ({
        skill,
        players: activePlayers
          .filter((p) => p.skill === skill)
          .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
      })).filter((g) => g.players.length > 0),
    [activePlayers],
  );

  // Só formatos que fecham exato — o admin seleciona o número certo.
  const formats = useMemo(
    () => validFormats(count).filter((f) => f.leftover === 0),
    [count],
  );

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleGroup(groupPlayers: Player[], allSelected: boolean) {
    const ids = groupPlayers.map((p) => p.id);
    setSelectedIds((prev) => {
      if (allSelected) {
        const drop = new Set(ids);
        return prev.filter((x) => !drop.has(x));
      }
      const have = new Set(prev);
      return [...prev, ...ids.filter((id) => !have.has(id))];
    });
  }

  function addGuest(name: string) {
    const guest: Player = {
      id: uid(),
      name,
      skill: 3,
      active: true,
      guest: true,
    };
    setGuests((prev) => [...prev, guest]);
  }

  function setGuestSkill(id: string, skill: Skill) {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, skill } : g)),
    );
  }

  function removeGuest(id: string) {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  }

  function runDraw(format: Format) {
    if (!group) return;
    // count === total garantido: só formatos leftover === 0 aparecem.
    const seed = Date.now();
    const result = drawTeams(pool, format.numTeams, format.perTeam, seed);
    saveLastResult(result);

    // Snapshot imutável no histórico — congela nome/skill, não guarda ids.
    const teams: DrawPlayer[][] = result.teams.map((team) =>
      team.players.map((p) => ({
        id: p.id,
        name: p.name,
        skill: p.skill,
        ...(p.guest ? { guest: true as const } : {}),
      })),
    );
    const draw: Draw = {
      id: uid(),
      groupId: group.id,
      createdAt: seed,
      seed,
      numTeams: format.numTeams,
      perTeam: format.perTeam,
      teams,
      ...(result.starters ? { starters: result.starters } : {}),
      ...(result.starterSeed !== undefined
        ? { starterSeed: result.starterSeed }
        : {}),
    };
    saveDraw(draw);

    router.push('/resultado');
  }

  return (
    <main className="mx-auto min-h-dvh max-w-md pb-44">
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
            Sorteio
          </h1>
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

      <div className="space-y-4 px-4 pt-4">
        <GuestAdder onAdd={addGuest} />

        {guests.length > 0 && (
          <ul className="space-y-2">
            {guests.map((g) => (
              <li key={g.id}>
                <GuestCard
                  guest={g}
                  onSkill={(skill) => setGuestSkill(g.id, skill)}
                  onRemove={() => removeGuest(g.id)}
                />
              </li>
            ))}
          </ul>
        )}

        {loading ? (
          <p className="py-16 text-center text-sm text-slate-500">
            Carregando jogadores…
          </p>
        ) : activePlayers.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
            <p className="font-medium text-slate-200">
              Nenhum jogador ativo no elenco
            </p>
            <p className="text-sm text-slate-500">
              Adicione visitantes acima ou{' '}
              <Link href="/elenco" className="text-grass-soft underline">
                ative jogadores no elenco
              </Link>
              .
            </p>
          </div>
        ) : searching ? (
          visible.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">
              Ninguém com “{query.trim()}” no elenco ativo.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {visible.map((p) => (
                <PlayerTile
                  key={p.id}
                  name={p.name}
                  selected={selectedSet.has(p.id)}
                  onToggle={() => toggle(p.id)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="space-y-5">
            {groups.map((g) => {
              const selInGroup = g.players.filter((p) =>
                selectedSet.has(p.id),
              ).length;
              const state =
                selInGroup === 0
                  ? 'none'
                  : selInGroup === g.players.length
                    ? 'all'
                    : 'partial';
              return (
                <div key={g.skill} className="space-y-2">
                  <LevelGroupHeader
                    label={levelName(g.skill)}
                    count={g.players.length}
                    selection={{
                      state,
                      onToggleAll: () => toggleGroup(g.players, state === 'all'),
                    }}
                  />
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {g.players.map((p) => (
                      <PlayerTile
                        key={p.id}
                        name={p.name}
                        selected={selectedSet.has(p.id)}
                        onToggle={() => toggle(p.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!loading && (
        <SortearFooter
          count={count}
          formats={formats}
          onPick={runDraw}
          onClear={() => {
            setSelectedIds([]);
            setGuests([]);
          }}
        />
      )}
    </main>
  );
}
