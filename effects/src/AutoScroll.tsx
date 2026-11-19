'use client';

import { useEffect } from 'react';

/** Pixels per frame (~60fps). Kept gentle so motion feels like drift, not a scrub. */
const SPEED_PX: Record<'slow' | 'normal' | 'fast', number> = {
  slow: 0.18,
  normal: 0.35,
  fast: 0.7,
};

export function AutoScroll({
  enabled,
  speed,
}: {
  enabled: boolean;
  speed: 'slow' | 'normal' | 'fast';
}) {
  useEffect(() => {
    if (!enabled) return;

    const step = SPEED_PX[speed] ?? SPEED_PX.normal;
    const root = (document.scrollingElement || document.documentElement) as HTMLElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    let stopped = false;
    let raf = 0;
    let startTimer = 0;
    let last = 0;
    let carry = 0;

    const stop = () => {
      stopped = true;
      if (raf) cancelAnimationFrame(raf);
    };

    const tick = (now: number) => {
      if (stopped) return;
      if (!last) last = now;
      const dt = Math.min(32, now - last);
      last = now;

      const max = root.scrollHeight - root.clientHeight;
      if (max <= 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (root.scrollTop >= max - 1) {
        stop();
        return;
      }

      // Accumulate fractional pixels so slow speeds stay smooth.
      carry += step * (dt / 16.67);
      if (carry >= 1) {
        const px = Math.floor(carry);
        carry -= px;
        root.scrollTop = Math.min(max, root.scrollTop + px);
      }
      raf = requestAnimationFrame(tick);
    };

    // Wait for open/reveal animations before drifting.
    startTimer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 1200);

    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('pointerdown', stop, { passive: true });
    window.addEventListener('keydown', stop);

    return () => {
      stop();
      root.style.scrollBehavior = previous;
      window.clearTimeout(startTimer);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('pointerdown', stop);
      window.removeEventListener('keydown', stop);
    };
  }, [enabled, speed]);

  return null;
}
