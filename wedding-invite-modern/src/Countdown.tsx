'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useModern } from './context';
import { googleCalendarUrl, text } from './fields';
import Reveal from './Reveal';
import Sparkles from './Sparkles';

/** Each digit rolls in from above when it changes, like a split-flap board. */
function RollingNumber({ value }: { value: number | undefined }) {
  const digits = value == null ? ['—'] : Array.from(String(value).padStart(2, '0'));
  return (
    <span className="elm-count__num" aria-live="off">
      {digits.map((d, i) => (
        <span key={`${digits.length}-${i}`} className="elm-roll">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={d}
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {d}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function partsUntil(target: number): Parts | null {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  const { data, t, groom, bride, eventDate, lowPower } = useModern();
  const target = eventDate?.getTime() ?? 0;
  // Starts empty so server and first client render match; filled after mount.
  const [parts, setParts] = useState<Parts | null | undefined>(undefined);

  useEffect(() => {
    if (!target) return;
    const tick = () => setParts(partsUntil(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (!eventDate) return null;

  const cells: Array<[string, number | undefined]> = [
    [t.days, parts?.days],
    [t.hours, parts?.hours],
    [t.minutes, parts?.minutes],
    [t.seconds, parts?.seconds],
  ];
  const location = [text(data.venue), text(data.address), text(data.city)].filter(Boolean).join(', ');

  return (
    <section className="elm-section elm-count" id="countdown">
      {!lowPower ? <Sparkles count={22} maxAlpha={0.35} /> : null}
      <div className="elm-container" style={{ textAlign: 'center', position: 'relative' }}>
        <div className="elm-head elm-head--center">
          <span className="elm-eyebrow">{t.countdown}</span>
          {parts === null ? <h2 className="elm-display elm-h2">{t.happened}</h2> : null}
        </div>
        {parts !== null ? (
          <Reveal className="elm-count__grid">
            {cells.map(([label, value]) => (
              <div key={label} className="elm-count__cell">
                <RollingNumber value={value} />
                <span className="elm-eyebrow">{label}</span>
              </div>
            ))}
          </Reveal>
        ) : null}
        <a
          className="elm-btn"
          href={googleCalendarUrl({
            title: `${groom} & ${bride}`,
            start: eventDate,
            location,
            details: text(data.quote),
          })}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.addToCalendar}
        </a>
      </div>
    </section>
  );
}
