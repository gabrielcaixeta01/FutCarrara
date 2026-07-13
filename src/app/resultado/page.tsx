'use client';

/**
 * PLACEHOLDER — etapa 5 (Resultado + lib/whatsapp.ts) vai reescrever esta tela.
 * Por ora só fecha o fluxo do /sorteio: lê o snapshot do último sorteio
 * (inclui visitantes) e lista os times por nome.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { DrawResult } from '@/types';
import { loadLastResult } from '@/lib/storage';

export default function ResultadoPage() {
  const [result, setResult] = useState<DrawResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setResult(loadLastResult());
    setLoading(false);
  }, []);

  return (
    <main className="mx-auto min-h-dvh max-w-md px-4 pb-16">
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
      </header>

      {loading ? (
        <p className="py-16 text-center text-sm text-slate-500">Carregando…</p>
      ) : !result ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-slate-400">Nenhum sorteio ainda.</p>
          <Link
            href="/sorteio"
            className="h-11 rounded-xl bg-grass px-5 font-semibold leading-11 text-pitch hover:bg-grass-soft"
          >
            Fazer um sorteio
          </Link>
        </div>
      ) : (
        <div className="space-y-4 pt-4">
          {result.teams.map((team, i) => {
            const isStarter = result.starters?.includes(i);
            return (
              <section
                key={i}
                className="rounded-2xl border border-line bg-pitch-soft p-4"
              >
                <h2 className="mb-2 flex items-center gap-2 font-semibold text-slate-100">
                  Time {i + 1}
                  {isStarter && (
                    <span className="rounded-full bg-grass/20 px-2 py-0.5 text-xs font-medium text-grass-soft">
                      começa
                    </span>
                  )}
                </h2>
                <ul className="space-y-1 text-sm text-slate-300">
                  {team.players.map((p) => (
                    <li key={p.id} className="flex items-center gap-2">
                      {p.name}
                      {p.guest && (
                        <span className="rounded-full bg-grass/15 px-1.5 py-0.5 text-xs text-grass-soft">
                          visitante
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          <Link
            href="/sorteio"
            className="block h-12 rounded-xl border border-line text-center font-medium leading-12 text-slate-200 hover:bg-line"
          >
            Sortear de novo
          </Link>
        </div>
      )}
    </main>
  );
}
