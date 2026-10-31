'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { BlossomBranch } from './Blossom';
import { useModern } from './context';
import { EASE, EASE_IN_OUT, InkReveal, SplitText } from './Reveal';
import Sparkles from './Sparkles';

const SIDES = ['left', 'right'] as const;

const BRANCHES = [
  { key: 'tl', flip: false, vertical: false, dx: -80 },
  { key: 'tr', flip: true, vertical: false, dx: 80 },
  { key: 'bl', flip: false, vertical: true, dx: -80 },
  { key: 'br', flip: true, vertical: true, dx: 80 },
] as const;

/**
 * Red lacquer double doors with a gold 囍 medallion split across the seam. Tap → the doors swing
 * open onto the invite. `onBegin` fires inside the tap (browsers only allow audio there),
 * `onReveal` once the doors start to part, `onDone` when they are fully open.
 */
export default function Gate({
  guestName,
  sparkles,
  onBegin,
  onReveal,
  onDone,
}: {
  guestName: string;
  sparkles: boolean;
  onBegin: () => void;
  onReveal: () => void;
  onDone: () => void;
}) {
  const { t, groom, bride } = useModern();
  const [opening, setOpening] = useState(false);
  const timers = useRef<number[]>([]);

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
    if (opening) return;
    onBegin();
    setOpening(true);
    timers.current.push(window.setTimeout(onReveal, 450), window.setTimeout(onDone, 2300));
  };

  return (
    <motion.div className="elm-doorgate" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <motion.div
        className="elm-doorgate__light"
        initial={{ opacity: 0 }}
        animate={opening ? { opacity: [0, 1, 0] } : { opacity: 0 }}
        transition={{ duration: 2.2, times: [0, 0.3, 1], ease: 'easeOut' }}
      />

      <button type="button" className="elm-doorgate__stage" onClick={open} disabled={opening} aria-label={t.open}>
        {SIDES.map((side) => (
          <motion.span
            key={side}
            className={`elm-door elm-door--${side}`}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: opening ? (side === 'left' ? -112 : 112) : 0 }}
            transition={{ duration: 1.8, delay: 0.35, ease: EASE_IN_OUT }}
          >
            <span className="elm-door__panel elm-door__panel--top" />
            <span className="elm-door__panel elm-door__panel--bottom" />
            <span className="elm-door__seal">
              <span className="elm-door__hy">囍</span>
            </span>
          </motion.span>
        ))}
      </button>

      {sparkles ? (
        <div className="elm-doorgate__dust">
          <Sparkles count={22} color="246,214,140" maxAlpha={0.75} />
        </div>
      ) : null}

      {BRANCHES.map((branch, i) => (
        <motion.div
          key={branch.key}
          className={`elm-doorgate__branch elm-doorgate__branch--${branch.key}`}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={opening ? { opacity: 0, x: branch.dx, scale: 1.05 } : { opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: opening ? 0.9 : 1.4, delay: opening ? 0.2 : 0.4 + i * 0.15, ease: EASE }}
        >
          <div className="elm-sway" style={{ animationDelay: `${i * -1.3}s` }}>
            <BlossomBranch flip={branch.flip} style={branch.vertical ? { transform: 'scaleY(-1)' } : undefined} />
          </div>
        </motion.div>
      ))}

      <motion.div
        className="elm-doorgate__top"
        animate={{ opacity: opening ? 0 : 1, y: opening ? -20 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.p
          className="elm-eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          {t.theWeddingOf}
        </motion.p>
        <h1 className="elm-display elm-doorgate__names">
          <SplitText text={groom} play delay={0.35} />
          <InkReveal play delay={0.9} className="elm-italic elm-doorgate__amp">
            &amp;
          </InkReveal>
          <SplitText text={bride} play delay={0.6} />
        </h1>
      </motion.div>

      <motion.div
        className="elm-doorgate__foot"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: opening ? 0 : 1, y: 0 }}
        transition={{ delay: opening ? 0 : 1.3, duration: opening ? 0.4 : 1 }}
      >
        {guestName ? (
          <div>
            <p className="elm-eyebrow">{t.dearGuest}</p>
            <p className="elm-doorgate__guest">{guestName}</p>
          </div>
        ) : null}
        <motion.p
          className="elm-eyebrow"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {t.tapToOpen}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
