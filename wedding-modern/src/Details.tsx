'use client';

import { Kicker, Reveal } from './motion';

export default function Details({
  venue,
  city,
  hosts,
  note,
  mapsUrl,
}: {
  venue: string;
  city: string;
  hosts: string;
  note: string;
  mapsUrl: string;
}) {
  return (
    <section id="dia-diem" className="px-5 py-28" style={{ background: 'var(--el-bg-soft)' }}>
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
        <Reveal>
          <Kicker>Địa điểm</Kicker>
          <h2 className="mt-4 font-display text-5xl" style={{ color: 'var(--el-ink)' }}>
            {venue || 'Venue'}
          </h2>
          {city ? (
            <p className="mt-3 text-sm uppercase tracking-[0.22em]" style={{ color: 'var(--el-muted)' }}>
              {city}
            </p>
          ) : null}
          {mapsUrl ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.22em]"
              style={{ background: 'var(--el-accent)', color: 'var(--el-on-accent)' }}
            >
              Mở bản đồ
            </a>
          ) : null}
        </Reveal>
        <Reveal delay={0.1}>
          {hosts ? (
            <p className="font-serif text-xl leading-relaxed" style={{ color: 'var(--el-ink)' }}>
              {hosts}
            </p>
          ) : null}
          {note ? (
            <p className="mt-6 text-sm leading-relaxed" style={{ color: 'var(--el-muted)' }}>
              {note}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
