'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useJourney } from './context';
import { Sheet } from './ui';

export type Wish = { name: string; message: string };

/** Approved wishes for a live invite; preview (no slug) shows sample lines so the ticker is visible. */
export function useWishes() {
  const { eventSlug, t, isEditing } = useJourney();
  const [wishes, setWishes] = useState<Wish[]>([]);

  useEffect(() => {
    if (!eventSlug) {
      setWishes(
        t.sampleWishes.split('|').map((message, i) => ({ name: ['Lan', 'Minh', 'Thảo'][i % 3], message })),
      );
      return;
    }
    let cancelled = false;
    fetch(`/api/wishes?slug=${encodeURIComponent(eventSlug)}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : []))
      .then((rows: unknown) => {
        if (cancelled || !Array.isArray(rows)) return;
        setWishes(
          rows
            .map((r) => ({ name: String(r?.name || '').trim(), message: String(r?.message || '').trim() }))
            .filter((w) => w.message),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [eventSlug, t.sampleWishes, isEditing]);

  const add = useCallback((wish: Wish) => setWishes((list) => [wish, ...list]), []);
  return { wishes, add };
}

/** One wish at a time drifting in at the top of the column. */
export function WishTicker({ wishes }: { wishes: Wish[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (wishes.length < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % wishes.length), 5200);
    return () => window.clearInterval(timer);
  }, [wishes.length]);

  useEffect(() => setIndex(0), [wishes]);

  const wish = wishes[index];
  if (!wish) return null;

  return (
    <div className="lj-ticker" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${index}-${wish.message}`}
          className="lj-ticker__item"
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.55 }}
        >
          <span className="lj-ticker__avatar">{(wish.name || '♥').charAt(0).toUpperCase()}</span>
          <span className="lj-ticker__text">
            {wish.name ? <strong>{wish.name}: </strong> : null}
            {wish.message}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function WishSheet({
  open,
  onClose,
  onSent,
  guestName,
}: {
  open: boolean;
  onClose: () => void;
  onSent: (wish: Wish) => void;
  guestName: string;
}) {
  const { t, eventSlug } = useJourney();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (guestName) setName((current) => current || guestName);
  }, [guestName]);

  useEffect(() => {
    if (open) {
      setState('idle');
      setError('');
    }
  }, [open]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const wish = { name: name.trim(), message: message.trim() };
    if (!wish.message) {
      setError(t.wishRequired);
      return;
    }
    setError('');
    setState('sending');
    try {
      if (eventSlug) {
        const res = await fetch('/api/wishes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: eventSlug, ...wish }),
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.error || t.errorGeneric);
      }
      onSent(wish);
      setMessage('');
      setState('done');
    } catch (err) {
      setState('idle');
      setError(err instanceof Error ? err.message : t.errorGeneric);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title={t.wishTitle} closeLabel={t.close}>
      {state === 'done' ? (
        <p className="lj-sheet__lead">{eventSlug ? t.wishSent : t.previewNote}</p>
      ) : (
        <form className="lj-form" onSubmit={submit} noValidate>
          <label className="lj-form__label" htmlFor="lj-wish-name">
            {t.wishName}
          </label>
          <input
            id="lj-wish-name"
            className="lj-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            autoComplete="name"
          />
          <label className="lj-form__label" htmlFor="lj-wish-message">
            {t.wishMessage}
          </label>
          <textarea
            id="lj-wish-message"
            className="lj-input lj-input--area"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.wishPlaceholder}
            maxLength={500}
            rows={4}
          />
          {error ? <p className="lj-form__error">{error}</p> : null}
          <button type="submit" className="lj-pill lj-pill--cta lj-form__submit" disabled={state === 'sending'}>
            {state === 'sending' ? t.sending : t.sendWish}
          </button>
        </form>
      )}
    </Sheet>
  );
}
