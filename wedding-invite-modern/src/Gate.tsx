'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useModern } from './context';
import { dotDate, imageUrl } from './fields';
import { EASE, EASE_IN_OUT, InkReveal, SplitText } from './Reveal';
import Sparkles from './Sparkles';

type Phase = 'idle' | 'breaking' | 'letter';

const initial = (name: string) => Array.from(name.trim().normalize('NFC').split(/\s+/).pop() || '')[0] || '';

/**
 * Full-screen cover with a wax-sealed envelope. Tap → seal breaks, flap opens, card rises,
 * then the cover slides away. `onBegin` fires inside the tap (browsers only allow audio there).
 */
export default function Gate({
  guestName,
  sparkles,
  onBegin,
  onDone,
}: {
  guestName: string;
  sparkles: boolean;
  onBegin: () => void;
  onDone: () => void;
}) {
  const { data, t, groom, bride, eventDate } = useModern();
  const cover = imageUrl(data.coverImage);
  const [phase, setPhase] = useState<Phase>('idle');
  const timers = useRef<number[]>([]);
  const monogram = `${initial(groom)}${initial(bride)}`;

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    const pending = timers.current;
    return () => {
      root.style.overflow = previous;
      pending.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const open = () => {
    if (phase !== 'idle') return;
    onBegin();
    setPhase('breaking');
    timers.current.push(
      window.setTimeout(() => setPhase('letter'), 900),
      window.setTimeout(onDone, 2300),
    );
  };

  const opening = phase !== 'idle';

  return (
    <motion.div
      className="elm-gate"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 1.1, ease: EASE_IN_OUT }}
    >
      {cover ? (
        <motion.div
          className="elm-gate__bg"
          style={{ backgroundImage: `url("${cover}")` }}
          initial={{ scale: 1.12 }}
          animate={{ scale: opening ? 1.18 : 1 }}
          transition={{ duration: opening ? 2.4 : 6, ease: 'easeOut' }}
        />
      ) : null}
      <div className="elm-gate__shade" />
      {sparkles ? <Sparkles count={26} /> : null}

      <motion.div
        className="elm-gate__top"
        animate={{ opacity: opening ? 0 : 1, y: opening ? -16 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.p
          className="elm-eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          {t.theWeddingOf}
        </motion.p>
        <h1 className="elm-display elm-gate__names">
          <SplitText text={groom} play delay={0.35} />
          <InkReveal play delay={0.9} className="elm-italic elm-gate__amp">
            &amp;
          </InkReveal>
          <SplitText text={bride} play delay={0.6} />
        </h1>
      </motion.div>

      <motion.button
        type="button"
        className="elm-env"
        onClick={open}
        aria-label={t.open}
        initial={{ opacity: 0, y: 40, rotate: -2 }}
        animate={{ opacity: 1, y: opening ? 24 : 0, rotate: opening ? 0 : -2 }}
        transition={{ delay: opening ? 0 : 1, duration: 1, ease: EASE }}
      >
        <span className="elm-env__back" />
        <motion.span
          className="elm-env__letter"
          style={{ zIndex: 2 }}
          animate={{ y: phase === 'letter' ? '-62%' : '0%' }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <span className="elm-eyebrow" style={{ fontSize: 9 }}>
            {t.invitation}
          </span>
          <span className="elm-env__letter-names">
            {groom} <span className="elm-italic">&amp;</span> {bride}
          </span>
          <span className="elm-eyebrow" style={{ fontSize: 9 }}>
            {dotDate(eventDate)}
          </span>
        </motion.span>
        <span className="elm-env__pocket" />
        <motion.span
          className="elm-env__flap"
          style={{ zIndex: phase === 'letter' ? 1 : 4 }}
          animate={{ rotateX: opening ? 180 : 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE_IN_OUT }}
        />
        <motion.span
          className="elm-env__seal"
          animate={opening ? { scale: 1 } : { scale: [1, 1.07, 1] }}
          transition={opening ? { duration: 0.2 } : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {(['left', 'right'] as const).map((side) => (
            <motion.span
              key={side}
              className={`elm-env__seal-half elm-env__seal-half--${side}`}
              animate={
                opening
                  ? { x: side === 'left' ? -26 : 26, y: 60, rotate: side === 'left' ? -38 : 38, opacity: 0 }
                  : { x: 0, y: 0, rotate: 0, opacity: 1 }
              }
              transition={{ duration: 0.8, ease: [0.5, 0, 0.75, 0] }}
            >
              {monogram}
            </motion.span>
          ))}
        </motion.span>
      </motion.button>

      <motion.div
        className="elm-gate__foot"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: opening ? 0 : 1, y: 0 }}
        transition={{ delay: opening ? 0 : 1.3, duration: opening ? 0.4 : 1 }}
      >
        {guestName ? (
          <div>
            <p className="elm-eyebrow">{t.dearGuest}</p>
            <p className="elm-gate__guest" style={{ margin: '6px 0 0' }}>
              {guestName}
            </p>
          </div>
        ) : null}
        <p className="elm-eyebrow">{t.tapToOpen}</p>
      </motion.div>
    </motion.div>
  );
}
