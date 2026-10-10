'use client';

import { useEffect, useState } from 'react';
import { Reveal } from './motion';

type Left = { days: number; hours: number; minutes: number; seconds: number };

const EMPTY: Left = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function calc(target: string): Left {
  const diff = +new Date(target) - Date.now();
  if (!target || Number.isNaN(+new Date(target)) || diff <= 0) return EMPTY;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [left, setLeft] = useState<Left>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    setLeft(calc(targetDate));
    const timer = window.setInterval(() => setLeft(calc(targetDate)), 1000);
    return () => window.clearInterval(timer);
  }, [targetDate]);

  const cells = [
    ['Ngày', left.days],
    ['Giờ', left.hours],
    ['Phút', left.minutes],
    ['Giây', left.seconds],
  ] as const;

  return (
    <section id="dem-nguoc" className="px-5 py-24" style={{ background: 'var(--el-ink)', color: 'var(--el-on-accent)' }}>
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.42em] text-white/60">Đếm ngược</p>
          <h2 className="mt-4 font-display text-5xl md:text-6xl">Đến ngày cưới</h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-px md:grid-cols-4" style={{ background: 'rgba(255,255,255,0.12)' }}>
          {cells.map(([label, value]) => (
            <div key={label} className="px-4 py-8" style={{ background: 'var(--el-ink)' }}>
              <p className="font-display text-5xl tabular-nums md:text-7xl">{ready ? String(value).padStart(2, '0') : '--'}</p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-white/55">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
