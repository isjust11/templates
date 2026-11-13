'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useJourney } from './context';
import { text } from './fields';
import { HeartLine, Sprig } from './Botanicals';
import { Fade } from './ui';

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function Rsvp({ guestName }: { guestName: string }) {
  const { data, t, eventSlug } = useJourney();
  const [name, setName] = useState('');
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(1);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const deadline = text(data.rsvpDeadline);

  useEffect(() => {
    if (guestName) setName((current) => current || guestName);
  }, [guestName]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t.nameRequired);
      return;
    }
    setError('');
    if (!eventSlug) {
      setStatus('done');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: eventSlug, name: name.trim(), attending, guests: attending ? guests : 0 }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || t.errorGeneric);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : t.errorGeneric);
    }
  };

  return (
    <section className="lj-panel lj-rsvp" id="lj-rsvp">
      <div className="lj-rule" aria-hidden="true">
        <span />
        <HeartLine size={14} />
        <span />
      </div>
      <Fade>
        <h2 className="lj-rsvp__title">{t.rsvp}</h2>
        {deadline ? (
          <p className="lj-rsvp__deadline">
            {t.rsvpBefore} {deadline}
          </p>
        ) : null}
      </Fade>

      {status === 'done' ? (
        <Fade className="lj-rsvp__done">
          <HeartLine size={28} />
          <p>{attending ? t.thanksYes : t.thanksNo}</p>
          {!eventSlug ? <small>{t.previewNote}</small> : null}
        </Fade>
      ) : (
        <Fade delay={0.1}>
          <form className="lj-form" onSubmit={submit} noValidate>
            <label className="lj-form__label" htmlFor="lj-rsvp-name">
              {t.fullName}
            </label>
            <input
              id="lj-rsvp-name"
              className="lj-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              autoComplete="name"
              maxLength={80}
            />

            <p className="lj-form__label">{t.willYouAttend}</p>
            <div className="lj-radios" role="radiogroup">
              {[
                { value: true, label: t.attending },
                { value: false, label: t.declining },
              ].map((opt) => (
                <label key={String(opt.value)} className={`lj-radio${attending === opt.value ? ' is-on' : ''}`}>
                  <input
                    type="radio"
                    name="lj-attending"
                    checked={attending === opt.value}
                    onChange={() => setAttending(opt.value)}
                  />
                  <span className="lj-radio__dot" aria-hidden="true" />
                  {opt.label}
                </label>
              ))}
            </div>

            {attending ? (
              <>
                <label className="lj-form__label" htmlFor="lj-rsvp-guests">
                  {t.guests}
                </label>
                <select
                  id="lj-rsvp-guests"
                  className="lj-input"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </>
            ) : null}

            {error ? <p className="lj-form__error">{error}</p> : null}
            <button type="submit" className="lj-pill lj-pill--cta lj-form__submit" disabled={status === 'sending'}>
              {status === 'sending' ? t.sending : t.send}
            </button>
          </form>
        </Fade>
      )}
      <Sprig className="lj-rsvp__sprig" />
    </section>
  );
}
