'use client';

export default function Footer({
  message,
  credit,
  groomName,
  brideName,
}: {
  message: string;
  credit: string;
  groomName: string;
  brideName: string;
}) {
  return (
    <footer className="px-5 py-24 text-center" style={{ background: 'var(--el-ink)', color: 'var(--el-on-accent)' }}>
      <p className="font-script text-4xl text-white/80">♡</p>
      <p className="mx-auto mt-6 max-w-xl font-serif text-2xl italic">{message}</p>
      <p className="mt-8 font-display text-4xl md:text-6xl">
        {groomName} & {brideName}
      </p>
      {credit ? <p className="mt-8 text-[11px] uppercase tracking-[0.28em] text-white/50">{credit}</p> : null}
    </footer>
  );
}
