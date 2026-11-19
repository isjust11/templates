'use client';

import { useJourney } from './context';
import { fieldStyle, text } from './fields';
import { WildSpray } from './Botanicals';
import { Fade } from './ui';

const pad = (n: number) => String(n).padStart(2, '0');

export default function Footer() {
  const { data, t, groom, bride, eventDate } = useJourney();
  const message = text(data.footerMessage);

  return (
    <footer className="lj-footer">
      <WildSpray className="lj-footer__spray" mirrored />
      <Fade>
        <p className="lj-footer__thanks">{t.thankYou}</p>
        {message ? (
          <p className="lj-footer__message" style={fieldStyle(data.footerMessage)}>
            {message}
          </p>
        ) : null}
        <p className="lj-footer__names">
          {groom} <em>&amp;</em> {bride}
        </p>
        {eventDate ? (
          <p className="lj-footer__date">
            {pad(eventDate.getDate())} . {pad(eventDate.getMonth() + 1)} . {eventDate.getFullYear()}
          </p>
        ) : null}
      </Fade>
    </footer>
  );
}
