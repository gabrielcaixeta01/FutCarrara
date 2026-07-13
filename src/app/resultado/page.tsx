'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Copy, Eye, EyeOff, RefreshCw } from 'lucide-react';
import type { Draw, DrawPlayer, DrawResult } from '@/types';
import { drawTeams, rerollStarters } from '@/lib/balance';
import {
  loadGroup,
  loadLastResult,
  saveDraw,
  saveLastResult,
} from '@/lib/storage';
import { uid } from '@/lib/utils';
import { formatForWhatsApp } from '@/lib/whatsapp';
import { TeamCard } from '@/components/resultado/TeamCard';
import { StartersBanner } from '@/components/resultado/StartersBanner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

/** Congela o resultado num Draw imutável (snapshot de nome/skill, não ids). */
function toDraw(result: DrawResult, groupId: string, seed: number): Draw {
  const teams: DrawPlayer[][] = result.teams.map((t) =>
    t.players.map((p) => ({
      id: p.id,
      name: p.name,
      skill: p.skill,
      ...(p.guest ? { guest: true as const } : {}),
    })),
  );
  return {
    id: uid(),
    groupId,
    createdAt: seed,
    seed,
    numTeams: result.teams.length,
    perTeam: result.teams[0]?.players.length ?? 0,
    teams,
    ...(result.starters ? { starters: result.starters } : {}),
    ...(result.starterSeed !== undefined
      ? { starterSeed: result.starterSeed }
      : {}),
  };
}

export default function ResultadoPage() {
  const [result, setResult] = useState<DrawResult | null>(null);
  const [groupName, setGroupName] = useState('Futebol Carrara');
  const [loading, setLoading] = useState(true);
  const [showLevels, setShowLevels] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmReshuffle, setConfirmReshuffle] = useState(false);

  useEffect(() => {
    setResult(loadLastResult());
    const g = loadGroup();
    if (g) setGroupName(g.name);
    setLoading(false);
  }, []);

  async function copyToWhatsApp() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(formatForWhatsApp(result, groupName));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sem permissão de clipboard: não trava o app.
    }
  }

  function rerollStartersHandler() {
    if (!result) return;
    const next = rerollStarters(result, Date.now());
    setResult(next);
    saveLastResult(next); // starters só na view/sessão; não vira novo Draw
  }

  function reshuffle() {
    if (!result) return;
    const pool = result.teams.flatMap((t) => t.players);
    const numTeams = result.teams.length;
    const perTeam = result.teams[0]?.players.length ?? 0;
    const seed = Date.now();
    const next = drawTeams(pool, numTeams, perTeam, seed);

    setResult(next);
    saveLastResult(next);
    const g = loadGroup();
    if (g) saveDraw(toDraw(next, g.id, seed)); // times novos = fato novo

    setConfirmReshuffle(false);
  }

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 pb-16">
      <header className="flex items-center gap-3 border-b border-line pb-3 pt-4">
        <Link
          href="/sorteio"
          aria-label="Voltar ao sorteio"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-pitch-soft hover:text-slate-100"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="flex-1 text-xl font-bold tracking-tight text-grass-soft">
          Resultado
        </h1>
        {result && (
          <button
            type="button"
            onClick={() => setShowLevels((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-100"
          >
            {showLevels ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
            {showLevels ? 'ocultar níveis' : 'ver níveis'}
          </button>
        )}
      </header>

      {loading ? (
        <p className="py-16 text-center text-sm text-slate-500">Carregando…</p>
      ) : !result ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-slate-400">Nenhum sorteio para mostrar.</p>
          <Link
            href="/sorteio"
            className="h-11 rounded-xl bg-grass px-5 font-semibold leading-11 text-pitch hover:bg-grass-soft"
          >
            Fazer um sorteio
          </Link>
        </div>
      ) : (
        <div className="space-y-4 pt-4">
          {result.starters && (
            <StartersBanner
              starters={result.starters}
              onReroll={rerollStartersHandler}
            />
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {result.teams.map((team, i) => (
              <TeamCard
                key={i}
                index={i}
                team={team}
                isStarter={result.starters?.includes(i) ?? false}
                showLevels={showLevels}
              />
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={copyToWhatsApp}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-grass font-semibold text-pitch transition-colors hover:bg-grass-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-grass-soft"
            >
              {copied ? (
                <Check className="size-5" />
              ) : (
                <Copy className="size-5" />
              )}
              {copied ? 'Copiado!' : 'Copiar pra WhatsApp'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmReshuffle(true)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line font-medium text-slate-200 transition-colors hover:bg-line focus:outline-none focus-visible:ring-2 focus-visible:ring-grass"
            >
              <RefreshCw className="size-5" />
              Sortear de novo
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmReshuffle}
        title="Sortear de novo?"
        message="Descarta os times atuais e monta tudo de novo, com os mesmos jogadores."
        confirmLabel="Sortear"
        tone="primary"
        onConfirm={reshuffle}
        onCancel={() => setConfirmReshuffle(false)}
      />
    </main>
  );
}
