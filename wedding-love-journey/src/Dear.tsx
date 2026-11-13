'use client';

import { useJourney } from './context';
import { fieldStyle, list, text } from './fields';
import { HeartLine, Sprig } from './Botanicals';
import { Fade } from './ui';

export default function Dear({ guestName }: { guestName: string }) {
  const { data, t } = useJourney();
  const greeting = text(data.greeting) || 'dear.';
  const lines = list<string>(data.welcomeLines).map((line) => text(line)).filter(Boolean);
  if (!lines.length && !guestName) return null;

  return (
    <section className="lj-panel lj-dear">
      <div className="lj-rule" aria-hidden="true">
        <span />
        <HeartLine size={14} />
        <span />
      </div>
      <Fade>
        <p className="lj-dear__greeting" style={fieldStyle(data.greeting)}>
          {greeting}
        </p>
      </Fade>
      {guestName ? (
        <Fade delay={0.1}>
          <p className="lj-dear__guest">
            {t.dearGuest} <strong>{guestName}</strong>
          </p>
        </Fade>
      ) : null}
      <Fade delay={0.15}>
        <div className="lj-dear__text" style={fieldStyle(data.welcomeLines)}>
          {lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </Fade>
      <Sprig className="lj-dear__sprig" />
    </section>
  );
}
