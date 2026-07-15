'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const DEFAULT_DURATION_MS = 2800;
const REDUCED_MOTION_DURATION_MS = 350;

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const timeoutMs = prefersReducedMotion
      ? REDUCED_MOTION_DURATION_MS
      : DEFAULT_DURATION_MS;

    const timeoutId = window.setTimeout(() => {
      setVisible(false);
    }, timeoutMs);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div aria-hidden className="splash-screen">
      <div className="splash-screen__backdrop" />
      <div className="splash-screen__card">
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