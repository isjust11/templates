'use client';

import { useJourney } from './context';
import { clockTime, fieldStyle, longDate, mapsEmbedUrl, mapsSearchUrl, text } from './fields';
import { Fade, SectionTitle } from './ui';

export default function Location() {
  const { data, t, lang, eventDate } = useJourney();
  const venue = text(data.venue);
  const address = text(data.address);
  const query = [venue, address].filter(Boolean).join(', ');
  if (!query) return null;

  const mapsUrl = text(data.mapsUrl) || mapsSearchUrl(query);
  const when = [clockTime(eventDate), text(data.eventDateDisplay) || longDate(eventDate, lang)].filter(Boolean).join(' · ');

  return (
    <section className="lj-section lj-location" id="lj-location">
      <SectionTitle>{t.location}</SectionTitle>
      <Fade>
        {venue ? (
          <p className="lj-location__venue" style={fieldStyle(data.venue)}>
            {venue}
          </p>
        ) : null}
        {address ? (
          <p className="lj-location__address" style={fieldStyle(data.address)}>
            {address}
          </p>
        ) : null}
        {when ? <p className="lj-location__when">{when}</p> : null}
      </Fade>
      <Fade delay={0.1} className="lj-frame lj-location__map">
        <iframe src={mapsEmbedUrl(query)} title={t.location} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </Fade>
      <Fade delay={0.15}>
        <a className="lj-pill lj-pill--outline" href={mapsUrl} target="_blank" rel="noreferrer">
          {t.directions}
        </a>
      </Fade>
    </section>
  );
}
