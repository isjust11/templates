'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useJourney } from './context';
import { imageUrl, list } from './fields';
import { Fade, SectionTitle } from './ui';

/** Repeating 7-photo rhythm: narrow + wide, wide + narrow, then three equal tiles. */
const PATTERN = ['n', 'w', 'w', 'n', 't', 't', 't'] as const;

export default function Album() {
  const { data, t } = useJourney();
  const photos = list(data.album).map(imageUrl).filter(Boolean);
  const [active, setActive] = useState<number | null>(null);

  const step = useCallback(
    (dir: number) => setActive((i) => (i == null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (active == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, step]);

  if (!photos.length) return null;

  return (
    <section className="lj-section" id="lj-album">
      <SectionTitle>{t.album}</SectionTitle>
      <div className="lj-album">
        {photos.map((src, i) => {
          const shape = photos.length === 1 ? 'full' : PATTERN[i % PATTERN.length];
          return (
            <Fade key={`${src}-${i}`} delay={(i % 3) * 0.08} y={18} className={`lj-album__item lj-album__item--${shape}`}>
              <button type="button" className="lj-frame" onClick={() => setActive(i)} aria-label={`${t.album} ${i + 1}`}>
                <img src={src} alt="" loading="lazy" />
              </button>
            </Fade>
          );
        })}
      </div>

      <AnimatePresence>
        {active != null ? (
          <motion.div
            className="lj-lightbox"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={active}
                src={photos[active]}
                alt=""
                className="lj-lightbox__img"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) step(1);
                  else if (info.offset.x > 60) step(-1);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>
            <p className="lj-lightbox__count">
              {active + 1} / {photos.length}
            </p>
            <button type="button" className="lj-lightbox__nav lj-lightbox__nav--prev" aria-label={t.prev} onClick={(e) => { e.stopPropagation(); step(-1); }}>
              ‹
            </button>
            <button type="button" className="lj-lightbox__nav lj-lightbox__nav--next" aria-label={t.next} onClick={(e) => { e.stopPropagation(); step(1); }}>
              ›
            </button>
            <button type="button" className="lj-lightbox__close" aria-label={t.close} onClick={() => setActive(null)}>
              ×
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
