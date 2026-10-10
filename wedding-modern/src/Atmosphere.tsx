'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { InviteEffects } from './theme';

const DOTS = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 53) % 100}%`,
  delay: (index % 7) * 0.4,
  duration: 7 + (index % 5),
  size: 4 + (index % 4) * 3,
}));

export function Atmosphere({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {DOTS.map((dot) => (
        <motion.span
          key={dot.id}
          className="absolute rounded-full"
          style={{
            left: dot.left,
            bottom: -20,
            width: dot.size,
            height: dot.size,
            background: 'color-mix(in srgb, var(--el-accent) 55%, white)',
          }}
          animate={{ y: [0, -920], opacity: [0, 0.7, 0] }}
          transition={{ duration: dot.duration, delay: dot.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

export function AutoScroll({
  enabled,
  speed,
}: {
  enabled: boolean;
  speed: InviteEffects['autoScrollSpeed'];
}) {
  useEffect(() => {
    if (!enabled) return;
    const step = speed === 'slow' ? 0.45 : speed === 'fast' ? 1.6 : 0.9;
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
