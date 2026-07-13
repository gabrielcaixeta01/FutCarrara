'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Group, Player, Skill } from '@/types';
import { loadGroup, saveGroup } from '@/lib/storage';
import { uid } from '@/lib/utils';

const DEFAULT_SKILL: Skill = 3;

const DEFAULT_PLAYERS: Array<{ name: string; active: boolean }> = [
  { name: 'Carrara', active: true },
  { name: 'Aquino', active: true },
  { name: 'Lucas', active: true },
  { name: 'Gui', active: true },
  { name: 'Pedro A', active: true },
  { name: 'Caland', active: true },
  { name: 'Caixeta', active: true },
  { name: 'Portugal', active: true },
  { name: 'Cauê', active: true },
  { name: 'Thiago M', active: true },
  { name: 'Dp', active: true },
  { name: 'Saad', active: true },
  { name: 'Felipe', active: true },
  { name: 'Marcelo', active: true },
  { name: 'PZ', active: true },
  { name: 'Tom', active: true },
  { name: 'Max', active: true },
  { name: 'Felipe F.', active: true },
  { name: 'GB', active: true },
  { name: 'Léo', active: true },
  { name: 'Gm', active: true },
  { name: 'Nenzin', active: true },
  { name: 'JP', active: true },
  { name: 'Dan', active: true },
  { name: 'André M.', active: false },
  { name: 'Rafael Augusto', active: false },
  { name: 'Victor (Felipe F.)', active: false },
  { name: 'Paim', active: false },
];

function createDefaultGroup(): Group {
  return {
    id: uid(),
    name: 'Futebol Carrara',
    players: DEFAULT_PLAYERS.map((player) => ({
      id: uid(),
      name: player.name,
      skill: DEFAULT_SKILL,
      active: player.active,
    })),
  };
}

export function useGroup() {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshGroup = useCallback(() => {
    const existing = loadGroup();
    if (existing) {
      setGroup(existing);
      return;
    }

    const fresh = createDefaultGroup();
    saveGroup(fresh);
    setGroup(fresh);
  }, []);

  // Carrega no mount. localStorage só existe no client, então isto roda
  // dentro de useEffect, nunca no render.
  useEffect(() => {
    refreshGroup();
    setLoading(false);
  }, [refreshGroup]);

  // Persiste a cada mutação. Roda só depois do load para não sobrescrever
  // o salvo com o estado inicial nulo.
  useEffect(() => {
    if (loading || !group) return;
    saveGroup(group);
  }, [group, loading]);

  const addPlayer = useCallback((name: string, skill: Skill) => {
    setGroup((prev) =>
      prev
        ? {
            ...prev,
            players: [
              ...prev.players,
              { id: uid(), name, skill, active: true },
            ],
          }
        : prev,
    );
  }, []);

  const updatePlayer = useCallback(
    (id: string, patch: Partial<Omit<Player, 'id'>>) => {
      setGroup((prev) =>
        prev
          ? {
              ...prev,
              players: prev.players.map((p) =>
                p.id === id ? { ...p, ...patch } : p,
              ),
            }
          : prev,
      );
    },
    [],
  );

  const removePlayer = useCallback((id: string) => {
    setGroup((prev) =>
      prev
        ? { ...prev, players: prev.players.filter((p) => p.id !== id) }
        : prev,
    );
  }, []);

  const toggleActive = useCallback((id: string) => {
    setGroup((prev) =>
      prev
        ? {
            ...prev,
            players: prev.players.map((p) =>
              p.id === id ? { ...p, active: !p.active } : p,
            ),
          }
        : prev,
    );
  }, []);

  const players = group?.players ?? [];

  return {
    group,
    players,
    addPlayer,
    updatePlayer,
    removePlayer,
    toggleActive,
    refreshGroup,
    loading,
  };
}
