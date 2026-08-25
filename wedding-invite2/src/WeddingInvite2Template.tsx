'use client';

import type { TemplateEventData } from './types';

function asData(data: Record<string, unknown> | TemplateEventData): TemplateEventData {
  return data as TemplateEventData;
}

/** Champagne / ink one-page — visually distinct from wedding-basic. */
export default function WeddingInvite2Template({
  data: raw,
}: {
  data: TemplateEventData | Record<string, unknown>;
}) {
  const data = asData(raw);
  const isVi = (data.locale || 'vi').startsWith('vi');

  return (
    <main className="min-h-screen bg-champagne-50 text-champagne-900">
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-romantic-100/80 via-transparent to-transparent" />
        <p className="relative mb-8 text-xs font-medium uppercase tracking-[0.45em] text-romantic-600">
          {isVi ? 'Thiệp mời cưới' : 'Wedding invitation'}
        </p>
        <h1 className="relative font-display text-6xl leading-none text-champagne-900 md:text-8xl">
          {data.groomName}
        </h1>
        <p className="relative my-6 font-script text-4xl text-romantic-500">&amp;</p>
        <h1 className="relative font-display text-6xl leading-none text-champagne-900 md:text-8xl">
          {data.brideName}
        </h1>
        <div className="relative mt-12 h-px w-24 bg-champagne-400" />
        <p className="relative mt-8 font-serif text-xl text-champagne-800">{data.eventDateDisplay}</p>
        <p className="relative mt-2 font-serif text-lg text-champagne-700">
          {data.venue}
          <span className="text-champagne-500"> · {data.city}</span>
        </p>
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-28 text-center">
        <blockquote className="font-serif text-2xl italic leading-relaxed text-champagne-800 md:text-3xl">
          “{data.quote}”
        </blockquote>
        {data.hosts ? (
          <p className="mt-10 text-sm uppercase tracking-[0.25em] text-champagne-600">{data.hosts}</p>
        ) : null}
        {data.mapsUrl ? (
          <a
            href={data.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 inline-flex rounded-full bg-romantic-600 px-8 py-3 text-sm font-medium uppercase tracking-wider text-white transition hover:bg-romantic-700"
          >
            {isVi ? 'Xem bản đồ' : 'Open map'}
          </a>
        ) : null}
      </section>
    </main>
  );
}
