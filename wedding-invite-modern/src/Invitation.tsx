'use client';

import { useModern } from './context';
import { fieldStyle, list, text } from './fields';
import { motion } from 'framer-motion';
import Garden from './Garden';
import Reveal, { EASE } from './Reveal';

function ParentsColumn({ label, father, mother, address }: { label: string; father: string; mother: string; address: string }) {
  return (
    <div className="elm-parents__col">
      <span className="elm-eyebrow" style={{ marginBottom: 10 }}>
        {label}
      </span>
      {father ? <span className="elm-parents__name">{father}</span> : null}
      {mother ? <span className="elm-parents__name">{mother}</span> : null}
      {address ? <span className="elm-parents__addr">{address}</span> : null}
    </div>
  );
}

export default function Invitation({ guestName }: { guestName: string }) {
  const { data, t, groom, bride } = useModern();
  const quote = text(data.quote);
  const lines = list<string>(data.welcomeLines).map((line) => text(line));
  const hasParents = [data.groomFather, data.groomMother, data.brideFather, data.brideMother].some((f) => text(f));

  return (
    <section className="elm-section" id="invitation">
      <Garden preset="invitation" />
      <motion.div
        className="elm-narrow elm-paper"
        initial={{ opacity: 0, y: 70, rotateX: 12 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 1.4, ease: EASE }}
        style={{ transformPerspective: 1200 }}
      >
        {quote ? (
          <Reveal>
            <p className="elm-quote" style={fieldStyle(data.quote)}>
              “{quote}”
            </p>
          </Reveal>
        ) : null}

        {hasParents ? (
          <Reveal className="elm-parents" delay={0.1}>
            <ParentsColumn
              label={t.groomSide}
              father={text(data.groomFather)}
              mother={text(data.groomMother)}
              address={text(data.groomAddress)}
            />
            <div className="elm-parents__sep" />
            <ParentsColumn
              label={t.brideSide}
              father={text(data.brideFather)}
              mother={text(data.brideMother)}
              address={text(data.brideAddress)}
            />
          </Reveal>
        ) : null}

        <Reveal className="elm-welcome" delay={0.15}>
          <span className="elm-eyebrow">{t.invitation}</span>
          {guestName ? <p className="elm-welcome__guest">{guestName}</p> : null}
          {lines.length ? (
            lines.map((line, i) => (
              <p key={i} style={{ margin: 0, minHeight: line ? undefined : '0.8em' }}>
                {line}
              </p>
            ))
          ) : (
            <p className="elm-welcome__couple">
              {groom} <span className="elm-italic">&amp;</span> {bride}
            </p>
          )}
          {text(data.hosts) ? (
            <p className="elm-eyebrow" style={{ marginTop: 32 }}>
              {text(data.hosts)}
            </p>
          ) : null}
        </Reveal>
      </motion.div>
    </section>
  );
}
