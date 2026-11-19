'use client';

import { motion } from 'framer-motion';
import { useJourney } from './context';
import { fieldStyle, longDate, text } from './fields';
import { Butterfly, Sprig, WildSpray } from './Botanicals';
import { EASE } from './ui';

export default function Hero({ started }: { started: boolean }) {
  const { data, lang, eventDate, groom, bride } = useJourney();
  const cover = text(data.coverImage);
  const dateLine = text(data.eventDateDisplay) || longDate(eventDate, lang);
  const venue = text(data.venue);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: started ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, delay, ease: EASE },
  });

  return (
    <section className="lj-hero" id="lj-top">
      <motion.div
        className="lj-hero__spray"
        initial={{ opacity: 0, scale: 0.92, rotate: -4 }}
        animate={started ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
        transition={{ duration: 1.6, ease: EASE }}
      >
        <div className="lj-sway">
          <WildSpray />
        </div>
      </motion.div>
      <Butterfly className="lj-hero__butterfly" />

      <h1 className="lj-hero__names">
        <motion.span {...rise(0.15)} style={fieldStyle(data.groomName)}>
          {groom}
        </motion.span>
        <motion.span {...rise(0.35)} className="lj-hero__amp">
          &amp;
        </motion.span>
        <motion.span {...rise(0.55)} style={fieldStyle(data.brideName)}>
          {bride}
        </motion.span>
      </h1>

      <motion.div
        className="lj-hero__arch"
        initial={{ opacity: 0, y: 40 }}
        animate={started ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
      >
        {cover ? (
          <motion.img
            src={cover}
            alt=""
            initial={{ scale: 1.12 }}
            animate={started ? { scale: 1 } : undefined}
            transition={{ duration: 2.6, delay: 0.6, ease: EASE }}
            style={fieldStyle(data.coverImage)}
          />
        ) : (
          <div className="lj-hero__placeholder" />
        )}
        <div className="lj-hero__caption">
          {dateLine ? (
            <p className="lj-hero__date" style={fieldStyle(data.eventDateDisplay)}>
              {dateLine}
            </p>
          ) : null}
          {venue ? (
            <p className="lj-hero__venue" style={fieldStyle(data.venue)}>
              {venue}
            </p>
          ) : null}
        </div>
      </motion.div>
      <Sprig className="lj-hero__sprig" />
    </section>
  );
}
