'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** 'danger' (padrão) = vermelho; 'primary' = verde. */
  tone?: 'danger' | 'primary';
}

/** Diálogo de confirmação para ações que valem uma pausa antes de acontecer. */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  tone = 'danger',
}: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-line bg-pitch-soft p-6 shadow-xl"
      >
        <h2 id="confirm-title" className="text-lg font-semibold text-slate-100">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-400">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="h-12 flex-1 rounded-xl border border-line font-medium text-slate-200 transition-colors hover:bg-line focus:outline-none focus-visible:ring-2 focus-visible:ring-grass"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              'h-12 flex-1 rounded-xl font-semibold transition-colors focus:outline-none focus-visible:ring-2',
              tone === 'primary'
                ? 'bg-grass text-pitch hover:bg-grass-soft focus-visible:ring-grass-soft'
                : 'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-400',
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
