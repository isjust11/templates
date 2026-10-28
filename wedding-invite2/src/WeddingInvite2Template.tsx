'use client';

import ThemeRoot from './ThemeRoot';
import type { TemplateEventData } from './types';

function asData(data: Record<string, unknown> | TemplateEventData): TemplateEventData {
  return data as TemplateEventData;
}

function fieldText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'object' && value !== null && 'type' in value) {
    const f = value as { value?: unknown; defaul?: unknown };
    return String(f.value ?? f.defaul ?? '');
  }
  return String(value);
}

/** Champagne / ink one-page — same --el-* token contract as wedding-basic. */
export default function WeddingInvite2Template({
  data: raw,
}: {
  data: TemplateEventData | Record<string, unknown>;
  eventSlug?: string;
}) {
  const data = asData(raw);
  const isVi = (data.locale || 'vi');

  return (
    <ThemeRoot data={data as Record<string, unknown>}>
      <main className="min-h-screen" style={{ background: 'var(--el-bg)', color: 'var(--el-ink)' }}>
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at top, color-mix(in srgb, var(--el-accent-soft) 55%, transparent), transparent 70%)',
            }}
          />
          <p
            className="relative mb-8 text-xs font-medium uppercase tracking-[0.45em]"
            style={{ color: 'var(--el-accent)' }}
          >
            {isVi ? 'Thiệp mời cưới' : 'Wedding invitation'}
          </p>
          <h1 className="relative font-display text-6xl leading-none md:text-8xl" style={{ color: 'var(--el-ink)' }}>
            {fieldText(data.groomName)}
          </h1>
          <p className="relative my-6 font-script text-4xl" style={{ color: 'var(--el-accent)' }}>
            &amp;
          </p>
          <h1 className="relative font-display text-6xl leading-none md:text-8xl" style={{ color: 'var(--el-ink)' }}>
            {fieldText(data.brideName)}
          </h1>
          <div className="relative mt-12 h-px w-24" style={{ background: 'var(--el-accent-soft)' }} />
          <p className="relative mt-8 font-serif text-xl" style={{ color: 'var(--el-muted)' }}>
            {fieldText(data.eventDateDisplay)}
          </p>
          <p className="relative mt-2 font-serif text-lg" style={{ color: 'var(--el-muted)' }}>
            {fieldText(data.venue)}
            <span style={{ color: 'var(--el-accent-soft)' }}> · {fieldText(data.city)}</span>
          </p>
        </section>

        <section className="mx-auto max-w-2xl px-6 pb-28 text-center">
          <blockquote className="font-serif text-2xl italic leading-relaxed md:text-3xl" style={{ color: 'var(--el-ink)' }}>
            “{fieldText((data as any).quote)}”
          </blockquote>
          {fieldText(data.hosts) ? (
            <p className="mt-10 text-sm uppercase tracking-[0.25em]" style={{ color: 'var(--el-muted)' }}>
              {fieldText(data.hosts)}
            </p>
          ) : null}
          {fieldText(data.mapsUrl) ? (
            <a
              href={fieldText(data.mapsUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-12 inline-flex rounded-full px-8 py-3 text-sm font-medium uppercase tracking-wider transition"
              style={{ background: 'var(--el-accent)', color: 'var(--el-on-accent)' }}
            >
              {isVi ? 'Xem bản đồ' : 'Open map'}
            </a>
          ) : null}
        </section>
      </main>
    </ThemeRoot>
  );
}
