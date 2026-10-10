'use client';

import { useState, type FormEvent } from 'react';
import { Kicker } from './motion';

export default function Rsvp({ eventSlug }: { eventSlug?: string }) {
  const [form, setForm] = useState({ name: '', attending: 'yes', guests: 1 });
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (honeypot) return;
    setLoading(true);
    setError('');
    try {
      if (!eventSlug) throw new Error('Mở thiệp qua đường dẫn sự kiện để gửi RSVP.');
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: eventSlug,
          name: form.name,
          attending: form.attending === 'yes',
          guests: Number(form.guests) || 1,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.message || 'Gửi thất bại');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không gửi được. Thử lại giúp mình.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp" className="px-5 py-28" style={{ background: 'var(--el-bg-soft)' }}>
      <div className="mx-auto max-w-xl">
        <Kicker>RSVP</Kicker>
        <h2 className="mt-4 font-display text-5xl" style={{ color: 'var(--el-ink)' }}>
          Xác nhận tham dự
        </h2>
        {done ? (
          <p className="mt-8 font-serif text-2xl" style={{ color: 'var(--el-ink)' }}>
            Đã nhận lời phản hồi. Hẹn gặp bạn trong ngày cưới.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-4">
            <input
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
            <input
              required
              name="name"
              placeholder="Tên của bạn"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border-b bg-transparent py-3 outline-none"
              style={{ borderColor: 'color-mix(in srgb, var(--el-ink) 25%, transparent)', color: 'var(--el-ink)' }}
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.attending}
                onChange={(e) => setForm({ ...form, attending: e.target.value })}
                className="border-b bg-transparent py-3 outline-none"
                style={{ borderColor: 'color-mix(in srgb, var(--el-ink) 25%, transparent)', color: 'var(--el-ink)' }}
              >
                <option value="yes">Tôi sẽ đến</option>
                <option value="no">Tôi không đến được</option>
              </select>
              <input
                type="number"
                min={1}
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                className="border-b bg-transparent py-3 outline-none"
                style={{ borderColor: 'color-mix(in srgb, var(--el-ink) 25%, transparent)', color: 'var(--el-ink)' }}
              />
            </div>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 rounded-full px-7 py-3 text-[11px] uppercase tracking-[0.22em] disabled:opacity-60"
              style={{ background: 'var(--el-accent)', color: 'var(--el-on-accent)' }}
            >
              {loading ? 'Đang gửi' : 'Gửi phản hồi'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
