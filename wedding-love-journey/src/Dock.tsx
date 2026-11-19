'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useJourney } from './context';
import { HeartLine } from './Botanicals';
import { Sheet } from './ui';

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 16, behavior: 'smooth' });
}

/** Hides the floating RSVP pill while the RSVP form itself is on screen. */
function useInView(id: string) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [id]);
  return inView;
}

export default function Dock({
  music,
  playing,
  onToggleSound,
  onWish,
}: {
  music: boolean;
  playing: boolean;
  onToggleSound: () => void;
  onWish: () => void;
}) {
  const { t, groom, bride } = useJourney();
  const [menu, setMenu] = useState(false);
  const rsvpVisible = useInView('lj-rsvp');

  const links = [
    { id: 'lj-top', label: `${groom} & ${bride}` },
    { id: 'lj-couple', label: t.theCouple },
    { id: 'lj-album', label: t.album },
    { id: 'lj-movie', label: t.movie },
    { id: 'lj-location', label: t.location },
    { id: 'lj-gift', label: t.gift },
    { id: 'lj-rsvp', label: t.rsvp },
  ];
  const [present, setPresent] = useState<string[]>([]);
  useEffect(() => {
    if (menu) setPresent(links.map((l) => l.id).filter((id) => document.getElementById(id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

  return (
    <>
      <motion.button
        type="button"
        className="lj-rsvp-pill"
        onClick={() => scrollToId('lj-rsvp')}
        animate={{ opacity: rsvpVisible ? 0 : 1, x: rsvpVisible ? 30 : 0 }}
        style={{ pointerEvents: rsvpVisible ? 'none' : 'auto' }}
        transition={{ duration: 0.35 }}
      >
        <HeartLine size={14} />
        {t.rsvp}
      </motion.button>

      <nav className="lj-dock">
        {music ? (
          <button type="button" className={`lj-dock__sound${playing ? ' is-on' : ''}`} onClick={onToggleSound} aria-pressed={playing}>
            <span className="lj-eq" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            {playing ? t.soundOn : t.soundOff}
          </button>
        ) : (
          <span />
        )}
        <button type="button" className="lj-dock__menu" aria-label={t.menu} onClick={() => setMenu(true)}>
          <span />
          <span />
          <span />
        </button>
        <button type="button" className="lj-dock__wish" onClick={onWish}>
          {t.sendWish}
        </button>
      </nav>

      <Sheet open={menu} onClose={() => setMenu(false)} title={t.menu} closeLabel={t.close}>
        <ul className="lj-menu">
          {links
            .filter((l) => present.includes(l.id))
            .map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => {
                    setMenu(false);
                    window.setTimeout(() => scrollToId(l.id), 320);
                  }}
                >
                  {l.label}
                </button>
              </li>
            ))}
        </ul>
      </Sheet>
    </>
  );
}
