'use client';

import { useJourney } from './context';
import { text, youtubeEmbedUrl } from './fields';
import { Fade, SectionTitle } from './ui';

export default function Movie() {
  const { data, t } = useJourney();
  const src = youtubeEmbedUrl(text(data.videoUrl));
  if (!src) return null;

  return (
    <section className="lj-section" id="lj-movie">
      <SectionTitle>{t.movie}</SectionTitle>
      <Fade className="lj-frame lj-movie">
        <iframe
          src={src}
          title={t.movie}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Fade>
    </section>
  );
}
