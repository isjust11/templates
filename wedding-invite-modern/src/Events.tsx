'use client';

import { useModern } from './context';
import { googleCalendarUrl, list, mapsEmbedUrl, mapsSearchUrl, text, type EventItem } from './fields';
import Reveal, { LineReveal } from './Reveal';

type Resolved = {
  label: string;
  time: string;
  dateDisplay: string;
  venue: string;
  address: string;
  mapsUrl: string;
};

export default function Events() {
  const { data, t, groom, bride, eventDate } = useModern();

  const fromList: Resolved[] = list<EventItem>(data.events)
    .map((e) => ({
      label: text(e?.label),
      time: text(e?.time),
      dateDisplay: text(e?.dateDisplay),
      venue: text(e?.venue),
      address: text(e?.address),
      mapsUrl: text(e?.mapsUrl),
    }))
    .filter((e) => e.label || e.time);

  // No explicit schedule → one card from the main event fields.
  const items: Resolved[] = fromList.length
    ? fromList
    : [
        {
          label: t.ceremony,
          time: eventDate
            ? `${String(eventDate.getHours()).padStart(2, '0')}:${String(eventDate.getMinutes()).padStart(2, '0')}`
            : '',
          dateDisplay: text(data.eventDateDisplay),
          venue: text(data.venue),
          address: [text(data.address), text(data.city)].filter(Boolean).join(', '),
          mapsUrl: text(data.mapsUrl),
        },
      ];

  const mainQuery = [text(data.venue), text(data.address), text(data.city)].filter(Boolean).join(', ');

  return (
    <section className="elm-section" id="schedule" style={{ background: 'var(--el-bg-soft)' }}>
      <div className="elm-container">
        <div className="elm-head">
          <span className="elm-eyebrow">{text(data.eventDateDisplay)}</span>
          <h2 className="elm-display elm-h2">
            <LineReveal>{t.schedule}</LineReveal>
          </h2>
        </div>

        <div className="elm-events">
          {items.map((e, i) => {
            const query = [e.venue, e.address].filter(Boolean).join(', ');
            const directions = e.mapsUrl || (query ? mapsSearchUrl(query) : '');
            return (
              <Reveal key={i} className="elm-event" delay={i * 0.1}>
                <span className="elm-eyebrow">{e.label}</span>
                {e.time ? <span className="elm-event__time">{e.time}</span> : null}
                {e.dateDisplay ? <span className="elm-muted">{e.dateDisplay}</span> : null}
                <div style={{ marginTop: 8 }}>
                  {e.venue ? <div className="elm-event__venue">{e.venue}</div> : null}
                  {e.address ? <div className="elm-muted" style={{ fontSize: 14 }}>{e.address}</div> : null}
                </div>
                <div className="elm-event__actions">
                  {directions ? (
                    <a className="elm-btn elm-btn--solid" href={directions} target="_blank" rel="noopener noreferrer">
                      {t.directions}
                    </a>
                  ) : null}
                  {eventDate && !fromList.length ? (
                    <a
                      className="elm-btn elm-btn--ghost"
                      href={googleCalendarUrl({ title: `${groom} & ${bride}`, start: eventDate, location: query })}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.addToCalendar}
                    </a>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </div>

        {mainQuery ? (
          <Reveal>
            <iframe
              className="elm-map"
              title={mainQuery}
              src={mapsEmbedUrl(mainQuery)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
