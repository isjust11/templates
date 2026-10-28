'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, type FormEvent } from 'react';
import { useModern } from './context';
import { text } from './fields';
import Reveal, { LineReveal } from './Reveal';

export default function Rsvp({ guestName }: { guestName: string }) {
  const { data, t, eventSlug } = useModern();
  const [name, setName] = useState(guestName);
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const deadline = text(data.rsvpDeadline);

  // `?to=` is read after mount, so prefill once it arrives unless the guest already typed.
  useEffect(() => {
    if (guestName) setName((current) => current || guestName);
  }, [guestName]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!name.trim()) {
      setError(t.nameRequired);
      return;
    }
    setError('');
    // Admin live preview has no slug: show the success state without saving.
    if (!eventSlug) {
      setDone(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: eventSlug,
          name: name.trim(),
          attending,
          guests: attending ? guests : 0,
          message: message.trim() || undefined,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || body.message || t.errorGeneric);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="elm-section" id="rsvp">
      <div className="elm-container elm-rsvp">
        <div className="elm-head" style={{ marginBottom: 0 }}>
          <span className="elm-eyebrow">RSVP</span>
          <h2 className="elm-display elm-h2">
            <LineReveal>{t.rsvp}</LineReveal>
          </h2>
          {deadline ? (
            <p className="elm-muted" style={{ margin: 0 }}>
              {t.rsvpBefore} <strong style={{ color: 'var(--el-ink)', fontWeight: 600 }}>{deadline}</strong>
            </p>
          ) : null}
          {!eventSlug ? (
            <p className="elm-eyebrow" style={{ color: 'var(--el-accent)' }}>
              {t.previewNote}
            </p>
          ) : null}
        </div>

        <Reveal>
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ borderTop: '1px solid var(--elm-line)', paddingTop: 32 }}
              >
                <p className="elm-display" style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}>
                  {t.thanks}
                </p>
                <p className="elm-muted">{attending ? t.thanksYes : t.thanksNo}</p>
              </motion.div>
            ) : (
              <motion.form key="form" className="elm-form" onSubmit={submit} exit={{ opacity: 0 }} noValidate>
                <label className="elm-field">
                  <span className="elm-eyebrow">{t.yourName}</span>
                  <input
                    className="elm-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    maxLength={120}
                  />
                </label>

                <div className="elm-seg" role="group">
                  <button type="button" aria-pressed={attending} onClick={() => setAttending(true)}>
                    {t.attending}
                  </button>
                  <button type="button" aria-pressed={!attending} onClick={() => setAttending(false)}>
                    {t.declining}
                  </button>
                </div>

                {attending ? (
                  <div className="elm-field">
                    <span className="elm-eyebrow">{t.guests}</span>
                    <div className="elm-stepper">
                      <button type="button" aria-label="-" onClick={() => setGuests((g) => Math.max(1, g - 1))}>
                        −
                      </button>
                      <output>{guests}</output>
                      <button type="button" aria-label="+" onClick={() => setGuests((g) => Math.min(10, g + 1))}>
                        +
                      </button>
                    </div>
                  </div>
                ) : null}

                <label className="elm-field">
                  <span className="elm-eyebrow">{t.message}</span>
                  <textarea
                    className="elm-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                    rows={3}
                  />
                </label>

                <input
                  className="elm-hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />

                {error ? <p className="elm-error">{error}</p> : null}

                <div>
                  <button type="submit" className="elm-btn elm-btn--solid" disabled={loading}>
                    {loading ? t.sending : t.send}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
