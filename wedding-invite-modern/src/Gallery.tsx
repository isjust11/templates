'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useModern } from './context';
import { imageUrl, list } from './fields';
import { EASE_IN_OUT, FadeImage, LineReveal } from './Reveal';

export default function Gallery() {
  const { data, t, groom, bride } = useModern();
  const images = list<unknown>(data.album).map(imageUrl).filter(Boolean);
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (delta: number) => setActive((i) => (i == null ? i : (i + delta + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (active == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close, step]);

  if (!images.length) return null;

  return (
    <section className="elm-section" id="gallery">
      <div className="elm-container">
        <div className="elm-head">
          <span className="elm-eyebrow">
            {groom} &amp; {bride}
          </span>
          <h2 className="elm-display elm-h2">
            <LineReveal>{t.gallery}</LineReveal>
          </h2>
        </div>
        {/* Tiles uncover one after another (curtain wipe) as the grid scrolls into view. */}
        <motion.div
          className="elm-gallery"
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ staggerChildren: 0.09 }}
        >
          {images.map((src, i) => (
            <motion.button
              key={src + i}
              type="button"
              className="elm-gallery__item"
              onClick={() => setActive(i)}
              variants={{
                hidden: { clipPath: 'inset(100% 0 0 0)' },
                shown: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 1.1, ease: EASE_IN_OUT } },
              }}
            >
              <FadeImage src={src} alt={`${t.gallery} ${i + 1}`} />
            </motion.button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {active != null ? (
          <motion.div
            className="elm-lightbox"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <span className="elm-lightbox__count">
              {active + 1} / {images.length}
            </span>
            <motion.img
              key={images[active]}
              src={images[active]}
              alt=""
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 60) step(info.offset.x < 0 ? 1 : -1);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <button type="button" className="elm-lightbox__btn" style={{ top: 12, right: 12 }} aria-label={t.close} onClick={close}>
              ✕
            </button>
            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  className="elm-lightbox__btn"
                  style={{ left: 12, top: 'calc(50% - 24px)' }}
                  aria-label={t.prev}
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="elm-lightbox__btn"
                  style={{ right: 12, top: 'calc(50% - 24px)' }}
                  aria-label={t.next}
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                >
                  →
                </button>
              </>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
