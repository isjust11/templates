'use client';

import { motion } from 'framer-motion';
import { listOf, textOf } from './fields';
import { Kicker, Reveal } from './motion';

export default function Schedule({ intro, schedule }: { intro: string; schedule: unknown }) {
  const items = listOf(schedule);
  if (!intro && items.length === 0) return null;

  return (
    <section id="lich-trinh" className="px-5 py-28" style={{ background: 'var(--el-bg)' }}>
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <Kicker>Lịch trình</Kicker>
          <h2 className="mt-4 font-display text-5xl" style={{ color: 'var(--el-ink)' }}>
            Trong ngày
          </h2>
          {intro ? (
            <p className="mt-5 max-w-2xl font-serif text-lg" style={{ color: 'var(--el-muted)' }}>
              {intro}
            </p>
          ) : null}
        </Reveal>
        <div className="mt-14 space-y-8">
          {items.map((item, index) => {
            const row = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
            const time = textOf(row.time);
            const title = textOf(row.title);
            const description = textOf(row.description);
            const image = textOf(row.image);
            return (
              <motion.article
                key={`${title}-${index}`}
                className="grid items-center gap-6 border-t pt-8 md:grid-cols-[120px_1fr_220px]"
                style={{ borderColor: 'color-mix(in srgb, var(--el-ink) 12%, transparent)' }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <p className="font-sans text-sm tabular-nums tracking-[0.18em]" style={{ color: 'var(--el-muted)' }}>
                  {time}
                </p>
                <div>
                  <h3 className="font-display text-3xl" style={{ color: 'var(--el-ink)' }}>
                    {title}
                  </h3>
                  {description ? (
                    <p className="mt-2 font-serif" style={{ color: 'var(--el-muted)' }}>
                      {description}
                    </p>
                  ) : null}
                </div>
                {image ? <img src={image} alt="" className="h-36 w-full object-cover md:h-28" /> : <div />}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
