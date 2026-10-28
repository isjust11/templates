'use client';

import { useModern } from './context';
import { dotDate, text } from './fields';

export default function Marquee() {
  const { data, groom, bride, eventDate } = useModern();
  const words = [`${groom} & ${bride}`, dotDate(eventDate) || text(data.eventDateDisplay), text(data.venue)].filter(
    Boolean,
  );
  const run = Array.from({ length: 4 }, () => words).flat();

  return (
    <div className="elm-marquee" aria-hidden="true">
      <div className="elm-marquee__track">
        {[0, 1].map((copy) => (
          <div key={copy} className="elm-marquee__item">
            {run.map((word, i) => (
              <span key={i} style={{ display: 'contents' }}>
                <span>{word}</span>
                <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
