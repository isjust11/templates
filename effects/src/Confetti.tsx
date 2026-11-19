'use client';

import { useCallback, useEffect, useState } from 'react';

export type ConfettiFn = (options?: Record<string, unknown>) => void;

const DEFAULT_COLORS = ['#717561', '#8a9273', '#9eaa8a', '#f7f4e6', '#ede8d5'];

export function playConfetti(confetti: ConfettiFn, colors: string[] = DEFAULT_COLORS) {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }
    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors,
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors,
    });
  }, 250);
}

/** Loads canvas-confetti only when the effect is enabled. `play` is a no-op until then. */
export function useConfettiPlayer(enabled: boolean) {
  const [confetti, setConfetti] = useState<ConfettiFn | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    import('canvas-confetti').then((module) => {
      if (!cancelled) setConfetti(() => module.default as ConfettiFn);
    });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return useCallback(() => {
    if (!enabled || !confetti) return;
    playConfetti(confetti);
  }, [enabled, confetti]);
}
