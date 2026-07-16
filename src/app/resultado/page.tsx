'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Copy, Eye, EyeOff, RefreshCw, Share2 } from 'lucide-react';
import type { DrawResult } from '@/types';
import { drawTeams, rerollStarters } from '@/lib/balance';
import { loadLastResult, saveLastResult } from '@/lib/storage';
import { GROUP_NAME } from '@/lib/roster';
import { drawCode, formatForWhatsApp } from '@/lib/whatsapp';
import { TeamCard } from '@/components/resultado/TeamCard';
import { StartersBanner } from '@/components/resultado/StartersBanner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export default function ResultadoPage() {
  const [result, setResult] = useState<DrawResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLevels, setShowLevels] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmReshuffle, setConfirmReshuffle] = useState(false);
  const [canShare, setCanShare] = useState(false);

  // sessionStorage só existe no client: por isso o resultado entra num effect.
  // navigator idem — e decidir o rótulo do botão no render quebraria a hidratação.
  useEffect(() => {
    setResult(loadLastResult());
    setLoading(false);
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  async function sendToWhatsApp() {
    if (!result) return;
    const text = formatForWhatsApp(result, GROUP_NAME);

    // Folha de compartilhamento nativa (celular): um toque até o WhatsApp.
    if (canShare) {
      try {
        await navigator.share({ text });
        return;
      } catch (err) {
        // Fechar a folha sem escolher app não é erro — e não merece fallback.
        if (err instanceof DOMException && err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sem share nem clipboard: não trava o app.
    }
  }

  function rerollStartersHandler() {
    if (!result) return;
    const next = rerollStarters(result, Date.now());
    setResult(next);
    saveLastResult(next);
  }

  function reshuffle() {
    if (!result) return;
    const pool = result.teams.flatMap((t) => t.players);
    const perTeam = result.teams[0]?.players.length ?? 0;
    const next = drawTeams(pool, result.teams.length, perTeam, Date.now());

    setResult(next);
    saveLastResult(next);
    setConfirmReshuffle(false);
  }

  return (
    <main className="mx-auto min-h-dvh max-w-md px-4 pb-28 sm:pb-16">
      <header className="flex items-end justify-between gap-3 border-b border-line/70 pb-4 pt-6">
        <h1 className="font-display text-4xl uppercase leading-none tracking-tight text-ink">
          Resultado
        </h1>
        {result && (
          <button
            type="button"
            onClick={() => setShowLevels((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-line bg-pitch-soft px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:text-ink"
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
        <p className="py-16 text-center text-sm text-ink-soft/75">Carregando…</p>
      ) : !result ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-ink-soft">Nenhum sorteio ainda.</p>
          <Link
            href="/sorteio"
            className="h-11 rounded-xl bg-grass px-5 font-semibold leading-11 text-pitch hover:bg-grass-soft"
          >
            Tirar times
          </Link>
        </div>
      ) : (
        <div className="space-y-4 pt-4">
          {result.starters && (
            <StartersBanner
              starters={result.starters}
              next={result.next}
              onReroll={rerollStartersHandler}
            />
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {result.teams.map((team, i) => (
              <TeamCard key={i} index={i} team={team} showLevels={showLevels} />
            ))}
          </div>

          {/* A seed publicada torna o sorteio auditável: mesma seed, mesmos times. */}
          <p className="text-center text-xs text-ink-soft/80">
            Sorteio #{drawCode(result.seed)}
          </p>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={sendToWhatsApp}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-grass font-semibold text-pitch transition-colors hover:bg-grass-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-grass-soft"
            >
              {copied ? (
                <Check className="size-5" />
              ) : canShare ? (
                <Share2 className="size-5" />
              ) : (
                <Copy className="size-5" />
              )}
              {copied
                ? 'Copiado!'
                : canShare
                  ? 'Mandar pro grupo'
                  : 'Copiar pra WhatsApp'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmReshuffle(true)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line font-medium text-ink transition-colors hover:bg-line focus:outline-none focus-visible:ring-2 focus-visible:ring-grass"
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
