'use client';

import Image from 'next/image';
import { Pill } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';

const ANIMATION_DURATION_MS = 2800;

export function MounjaroEasterEgg() {
  const [visible, setVisible] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const timeoutId = window.setTimeout(() => {
      setVisible(false);
    }, ANIMATION_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [visible, instanceKey]);

  return (
    <>
      <button
        type="button"
        aria-label="Abrir easter egg do Mounjaro"
        className="absolute right-5 top-5 z-20 inline-flex h-11 items-center gap-2 rounded-full border border-grass/30 bg-pitch-soft/90 px-3.5 text-grass-soft shadow-[0_8px_24px_-12px_rgba(0,0,0,0.9)] transition-transform hover:scale-105 active:scale-95"
        onClick={() => {
          setInstanceKey((current) => current + 1);
          setVisible(true);
        }}
      >
        <Pill className="size-5" />
        <span className="font-display text-[0.72rem] uppercase tracking-[0.22em] text-ink">
          Mounjaro
        </span>
      </button>

      {visible ? <MounjaroOverlay key={instanceKey} /> : null}
    </>
  );
}

function MounjaroOverlay() {
  return (
    <div
      aria-hidden
      className="splash-screen splash-screen--interactive"
      style={{ '--splash-duration': `${ANIMATION_DURATION_MS}ms` } as CSSProperties}
    >
      <div className="splash-screen__backdrop" />
      <div className="splash-screen__card splash-screen__card--interactive">
        <Image
          src="/splash.webp"
          alt=""
          width={512}
          height={512}
          priority
          className="splash-screen__image"
        />
      </div>
    </div>
  );
}