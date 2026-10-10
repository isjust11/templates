'use client';

import { Reveal, Kicker } from './motion';

export default function Welcome({ lines, highlightIndex }: { lines: string[]; highlightIndex: number }) {
  const visible = lines.filter((line) => line.trim().length > 0);
  if (!visible.length) return null;

  return (
    <section id="loi-moi" className="px-5 py-28" style={{ background: 'var(--el-bg)' }}>
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Kicker>Lời mời</Kicker>
        </Reveal>
        <div className="mt-8 space-y-3">
          {lines.map((line, index) =>
            line.trim() ? (
              <Reveal key={`${line}-${index}`} delay={index * 0.04}>
                <p
                  className={index === highlightIndex ? 'font-display text-4xl md:text-5xl' : 'font-serif text-xl md:text-2xl'}
                  style={{ color: index === highlightIndex ? 'var(--el-ink)' : 'var(--el-muted)' }}
                >
                  {line}
                </p>
              </Reveal>
            ) : (
              <div key={`gap-${index}`} className="h-3" />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
