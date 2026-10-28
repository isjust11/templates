'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useModern } from './context';
import { dotDate, fieldStyle, imageUrl, text, weekday } from './fields';
import { EASE, EASE_IN_OUT, InkReveal, SplitText } from './Reveal';

/** Intro waits for `revealed` so it plays after the gate slides away, not behind it. */
export default function Hero() {
  const { data, t, groom, bride, eventDate, intlLocale, revealed, lowPower } = useModern();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', lowPower ? '0%' : '-12%']);
  const namesY = useTransform(scrollYProgress, [0, 1], ['0%', lowPower ? '0%' : '18%']);
  const cover = imageUrl(data.coverImage);
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    transition: { duration: 1, delay, ease: EASE },
  });

  return (
    <section ref={ref} className="elm-hero" id="top">
      <div className="elm-container elm-hero__inner">
        <motion.div className="elm-hero__bar" {...fade(0.1)}>
          <span className="elm-eyebrow">{t.saveTheDate}</span>
          <span className="elm-eyebrow">{text(data.city)}</span>
        </motion.div>

        <div className="elm-hero__grid">
          <motion.h1 className="elm-display elm-hero__names" style={{ y: namesY }}>
            <SplitText text={groom} play={revealed} delay={0.2} style={fieldStyle(data.groomName)} />
            <InkReveal play={revealed} delay={0.75} className="elm-italic elm-hero__amp">
              &amp;
            </InkReveal>
            <SplitText text={bride} play={revealed} delay={0.5} style={fieldStyle(data.brideName)} />
          </motion.h1>

          {cover ? (
            <motion.div
              className="elm-hero__arch"
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              animate={{ clipPath: revealed ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)' }}
              transition={{ duration: 1.6, delay: 0.35, ease: EASE_IN_OUT }}
            >
              <motion.img
                src={cover}
                alt={`${groom} & ${bride}`}
                style={{ y: imageY }}
                initial={{ scale: 1.25 }}
                animate={{ scale: revealed ? 1 : 1.25 }}
                transition={{ duration: 2.2, delay: 0.35, ease: EASE }}
                decoding="async"
              />
            </motion.div>
          ) : null}
        </div>

        <motion.div className="elm-hero__meta" {...fade(0.9)}>
          <span className="elm-hero__date">{dotDate(eventDate) || text(data.eventDateDisplay)}</span>
          <span className="elm-eyebrow">
            {[weekday(eventDate, intlLocale), text(data.venue)].filter(Boolean).join(' — ')}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
