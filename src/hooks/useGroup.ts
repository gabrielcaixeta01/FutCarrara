'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Group, Player, Skill } from '@/types';
import { createSeedGroup, saveGroup } from '@/lib/storage';
import { uid } from '@/lib/utils';

export function useGroup() {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshGroup = useCallback(() => {
    const seed = createSeedGroup();
    saveGroup(seed);
    setGroup(seed);
  }, []);

  // Sempre sobe do seed do código ao iniciar a aplicação.
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
