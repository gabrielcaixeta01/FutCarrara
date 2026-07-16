'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Format, Player, Skill } from '@/types';
import { ROSTER } from '@/lib/roster';
import { drawTeams, validFormats } from '@/lib/balance';
import {
  clearLastResult,
  loadSelection,
  saveLastResult,
  saveSelection,
} from '@/lib/storage';
import { uid } from '@/lib/utils';
import { LEVELS_DESC, isHalf, levelName, levelOf } from '@/lib/levels';
import { PlayerTile } from '@/components/sorteio/PlayerTile';
import { LevelGroupHeader } from '@/components/ui/LevelGroupHeader';
import { SearchField } from '@/components/ui/SearchField';
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
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [guests, setGuests] = useState<Player[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    clearLastResult();
    // Recupera a seleção da sessão: um reload acidental (troca de app no
    // celular) não apaga os toques. Morre quando o app fecha.
    const stored = loadSelection();
    if (stored) {
      setSelectedIds(stored.selectedIds);
      setGuests(stored.guests);
    }
    setHydrated(true);
  }, []);

  // Só salva depois de hidratar, senão o estado inicial vazio atropela o salvo.
  useEffect(() => {
    if (!hydrated) return;
    saveSelection({ selectedIds, guests });
  }, [hydrated, selectedIds, guests]);

  const activePlayers = useMemo(() => ROSTER.filter((p) => p.active), []);
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

  // Sem busca: agrupa por nível base, do mais alto pro mais baixo. O meio ponto
  // é modificador dentro do grupo (▲ no nome), não seção própria. Grupos vazios somem.
  const groups = useMemo(
    () =>
      LEVELS_DESC.map((level) => ({
        level,
        players: activePlayers
          .filter((p) => levelOf(p.skill) === level)
          .sort(
            (a, b) =>
              b.skill - a.skill || a.name.localeCompare(b.name, 'pt-BR'),
          ),
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
    // count === total garantido: só formatos leftover === 0 aparecem.
    const seed = Date.now();
    const result = drawTeams(pool, format.numTeams, format.perTeam, seed);
    saveLastResult(result);
    router.push('/resultado');
  }

  return (
    // pb-60: o rodapé de status agora é sempre fixo — o conteúdo precisa
    // de folga pra ele + a navegação. O contador vive só lá embaixo.
    <main className="mx-auto min-h-dvh max-w-md pb-60 sm:pb-16">
      <header className="sticky top-0 z-20 space-y-4 border-b border-line/70 bg-pitch/85 px-4 pb-4 pt-6 backdrop-blur-xl">
        <h1 className="font-display text-4xl uppercase leading-none tracking-tight text-ink">
          Sorteio
        </h1>

        <SearchField value={query} onChange={setQuery} />
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

        {activePlayers.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
            <p className="font-medium text-ink">
              Nenhum jogador ativo no elenco
            </p>
            <p className="text-sm text-ink-soft/75">
              Adicione visitantes acima ou{' '}
              <Link href="/elenco" className="text-grass-soft underline">
                ative jogadores no elenco
              </Link>
              .
            </p>
          </div>
        ) : searching ? (
          visible.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink-soft/75">
              Ninguém com “{query.trim()}” no elenco ativo.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {visible.map((p) => (
                <PlayerTile
                  key={p.id}
                  name={p.name}
                  selected={selectedSet.has(p.id)}
                  half={isHalf(p.skill)}
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
                <div key={g.level} className="space-y-2">
                  <LevelGroupHeader
                    label={levelName(g.level)}
                    count={g.players.length}
                    selection={{
                      state,
                      onToggleAll: () => toggleGroup(g.players, state === 'all'),
                      selectedCount: selInGroup,
                    }}
                  />
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {g.players.map((p) => (
                      <PlayerTile
                        key={p.id}
                        name={p.name}
                        selected={selectedSet.has(p.id)}
                        half={isHalf(p.skill)}
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

      <SortearFooter
        count={count}
        formats={formats}
        onPick={runDraw}
        onClear={() => {
          setSelectedIds([]);
          setGuests([]);
        }}
      />
    </main>
  );
}
