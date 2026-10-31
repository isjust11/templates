'use client';

import { useEffect } from 'react';

export function AutoScroll({
  enabled,
  speed,
}: {
  enabled: boolean;
  speed: 'slow' | 'normal' | 'fast';
}) {
  useEffect(() => {
    if (!enabled) return;
    const step = speed === 'slow' ? 0.25 : speed === 'fast' ? 1.6 : 0.9;
    const root = (document.scrollingElement || document.documentElement) as HTMLElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    let timer = 0;
    let stopped = false;
    const stop = () => {
      stopped = true;
    };
    const tick = () => {
      if (stopped) return;
      const max = root.scrollHeight - root.clientHeight;
      if (max <= 0) return;
      if (root.scrollTop >= max - 1) {
        stopped = true;
        return;
      }
      root.scrollTop = Math.min(max, root.scrollTop + step);
    };
    const start = window.setTimeout(() => {
      timer = window.setInterval(tick, 16);
    }, 700);
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('keydown', stop);
    return () => {
      stopped = true;
      root.style.scrollBehavior = previous;
      window.clearTimeout(start);
      window.clearInterval(timer);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', stop);
    };
  }, [enabled, speed]);
  return null;
}
