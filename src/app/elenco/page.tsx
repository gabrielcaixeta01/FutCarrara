'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FileUp, Search, Upload, Users, X } from 'lucide-react';
import type { Player } from '@/types';
import { useGroup } from '@/hooks/useGroup';
import { exportJSON, importJSON } from '@/lib/storage';
import { AddPlayerForm } from '@/components/elenco/AddPlayerForm';
import { PlayerRow } from '@/components/elenco/PlayerRow';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

/** Normaliza pra busca: sem acento, minúsculo. "José" casa com "jose". */
function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export default function ElencoPage() {
  const {
    players,
    addPlayer,
    updatePlayer,
    removePlayer,
    toggleActive,
    refreshGroup,
    loading,
  } = useGroup();

  const [query, setQuery] = useState('');
  const [pendingRemoval, setPendingRemoval] = useState<Player | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCount = players.filter((p) => p.active).length;

  useEffect(() => {
    if (!importOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setImportOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [importOpen]);

  // Filtra por nome; ativos primeiro, alfabético dentro de cada grupo.
  const visible = useMemo(() => {
    const q = norm(query);
    return players
      .filter((p) => (q ? norm(p.name).includes(q) : true))
      .sort(
        (a, b) =>
          Number(b.active) - Number(a.active) ||
          a.name.localeCompare(b.name, 'pt-BR'),
      );
  }, [players, query]);

  function handleExport() {
    const blob = new Blob([exportJSON()], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `futcarrara-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  async function handleImportFile(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setImportText(text);
      setImportError(null);
    } catch {
      setImportError('Não consegui ler o arquivo selecionado.');
    } finally {
      event.target.value = '';
    }
  }

  function handleImportSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      importJSON(importText);
      refreshGroup();
      setImportOpen(false);
      setImportText('');
      setImportError(null);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Backup inválido.');
    }
  }

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
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-line bg-pitch-soft p-3">
          <button
            type="button"
            onClick={handleExport}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-pitch px-3 font-semibold text-slate-100 transition-colors hover:bg-line focus:outline-none focus-visible:ring-2 focus-visible:ring-grass"
          >
            <Download className="size-4" />
            Baixar JSON
          </button>
          <button
            type="button"
            onClick={() => {
              setImportError(null);
              setImportOpen(true);
            }}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-grass px-3 font-semibold text-pitch transition-colors hover:bg-grass-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-grass-soft"
          >
            <Upload className="size-4" />
            Importar
          </button>
        </div>
      </div>

      <div className="px-4 pt-4">
        <AddPlayerForm onAdd={addPlayer} nameRef={nameRef} />
      </div>

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
        ) : visible.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">
            Ninguém com “{query.trim()}” no elenco.
          </p>
        ) : (
          <ul className="space-y-2">
            {visible.map((p) => (
              <PlayerRow
                key={p.id}
                player={p}
                onSkill={(skill) => updatePlayer(p.id, { skill })}
                onToggle={() => toggleActive(p.id)}
                onRemove={() => setPendingRemoval(p)}
              />
            ))}
          </ul>
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

      {importOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          onClick={() => setImportOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="import-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-line bg-pitch-soft p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="import-title" className="text-lg font-semibold text-slate-100">
                  Importar backup
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Cole o JSON exportado ou carregue um arquivo para restaurar o elenco.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setImportOpen(false)}
                className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-pitch hover:text-slate-100"
                aria-label="Fechar"
              >
                <X className="size-5" />
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleImportSubmit}>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Arquivo JSON
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={handleImportFile}
                  className="block w-full rounded-xl border border-line bg-pitch px-3 py-2 text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-grass file:px-3 file:py-2 file:font-semibold file:text-pitch file:transition-colors hover:file:bg-grass-soft"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  JSON do backup
                </span>
                <textarea
                  value={importText}
                  onChange={(event) => setImportText(event.target.value)}
                  placeholder="Cole aqui o JSON exportado"
                  rows={10}
                  className="w-full rounded-xl border border-line bg-pitch px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-grass focus:outline-none focus-visible:ring-2 focus-visible:ring-grass"
                />
              </label>

              {importError && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {importError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setImportOpen(false)}
                  className="h-12 flex-1 rounded-xl border border-line font-medium text-slate-200 transition-colors hover:bg-line focus:outline-none focus-visible:ring-2 focus-visible:ring-grass"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-grass font-semibold text-pitch transition-colors hover:bg-grass-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-grass-soft"
                >
                  <FileUp className="size-4" />
                  Importar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
