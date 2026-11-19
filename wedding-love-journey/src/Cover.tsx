'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useJourney } from './context';
import { Sprig, WildSpray } from './Botanicals';
import { EASE } from './ui';

/** Sealed envelope over the page. The tap starts music (browsers need the gesture), then the card slides out. */
export default function Cover({
  guestName,
  onBegin,
  onDone,
}: {
  guestName: string;
  onBegin: () => void;
  onDone: () => void;
}) {
  const { t, groom, bride } = useJourney();
  const [opening, setOpening] = useState(false);

  const open = () => {
    if (opening) return;
    setOpening(true);
    onBegin();
    window.setTimeout(onDone, 1500);
  };

  return (
    <motion.div
      className="lj-cover"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: EASE } }}
    >
      <WildSpray className="lj-cover__spray" />
      <WildSpray className="lj-cover__spray lj-cover__spray--low" mirrored />

      <div className="lj-cover__body">
        {guestName ? (
          <p className="lj-cover__guest">
            {t.dearGuest} <strong>{guestName}</strong>
          </p>
        ) : (
          <p className="lj-cover__guest">{t.youAreInvited}</p>
        )}

        <button
          type="button"
          className={`lj-cover__envelope${opening ? ' is-opening' : ''}`}
          onClick={open}
          aria-label={t.open}
        >
          <span className="lj-cover__card">
            <span className="lj-cover__names">
              {groom}
              <em>&amp;</em>
              {bride}
            </span>
          </span>
          <span className="lj-cover__back" />
          <span className="lj-cover__front" />
          <span className="lj-cover__flap" />
          <span className="lj-cover__seal" aria-hidden="true">
            {(groom[0] || '').toUpperCase()}
            <i>·</i>
            {(bride[0] || '').toUpperCase()}
          </span>
        </button>

        <motion.button
          type="button"
          className="lj-pill lj-pill--cta"
          onClick={open}
          animate={opening ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {t.open}
        </motion.button>
        <Sprig className="lj-cover__sprig" />
      </div>
    </motion.div>
  );
}
