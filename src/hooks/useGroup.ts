'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Group, Player, Skill } from '@/types';
import { loadGroup, saveGroup } from '@/lib/storage';
import { uid } from '@/lib/utils';

function createDefaultGroup(): Group {
  return { id: uid(), name: 'Futebol Carrara', players: [] };
}

export function useGroup() {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega no mount. localStorage só existe no client, então isto roda
  // dentro de useEffect, nunca no render.
  useEffect(() => {
    const existing = loadGroup();
    if (existing) {
      setGroup(existing);
    } else {
      const fresh = createDefaultGroup();
      saveGroup(fresh);
      setGroup(fresh);
    }
    setLoading(false);
  }, []);

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
    loading,
  };
}
