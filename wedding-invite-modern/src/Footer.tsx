'use client';

import { useModern } from './context';
import { dotDate, fieldStyle, text } from './fields';
import { InkReveal } from './Reveal';

export default function Footer() {
  const { data, t, groom, bride, eventDate } = useModern();
  const message = text(data.footerMessage);

  return (
    <footer className="elm-footer">
      <div className="elm-container">
        {message ? (
          <p className="elm-muted" style={{ margin: '0 auto 28px', maxWidth: 520, ...fieldStyle(data.footerMessage) }}>
            {message}
          </p>
        ) : null}
        <h2 className="elm-display elm-footer__big">
          <InkReveal className="elm-italic" duration={2}>
            {t.thankYou}
          </InkReveal>
        </h2>
        <p className="elm-display" style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginTop: 28 }}>
          {groom} &amp; {bride}
        </p>
        <div className="elm-footer__credit">
          <span className="elm-eyebrow">{dotDate(eventDate) || text(data.eventDateDisplay)}</span>
          <span className="elm-eyebrow">{text(data.footerCredit)}</span>
        </div>
      </div>
    </footer>
  );
}
