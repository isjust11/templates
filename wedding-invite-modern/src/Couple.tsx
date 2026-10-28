'use client';

import { useModern } from './context';
import { imageUrl, text } from './fields';
import Reveal, { FadeImage, LineReveal } from './Reveal';

export default function Couple() {
  const { data, t, groom, bride } = useModern();
  const people = [
    { index: '01', role: t.groom, name: groom, photo: imageUrl(data.groomPhoto), bio: text(data.groomBio) },
    { index: '02', role: t.bride, name: bride, photo: imageUrl(data.bridePhoto), bio: text(data.brideBio) },
  ];
  if (!people.some((p) => p.photo || p.bio)) return null;

  return (
    <section className="elm-section" id="couple" style={{ paddingTop: 0 }}>
      <div className="elm-container">
        <div className="elm-head">
          <span className="elm-eyebrow">{t.theCouple}</span>
        </div>
        <div className="elm-couple">
          {people.map((p, i) => (
            <Reveal key={p.index} className="elm-person" delay={i * 0.12}>
              {p.photo ? (
                <div className="elm-person__img">
                  <FadeImage src={p.photo} alt={p.name} />
                </div>
              ) : null}
              <div className="elm-person__head">
                <h3 className="elm-display elm-person__name">
                  <LineReveal>{p.name}</LineReveal>
                </h3>
                <span className="elm-eyebrow">
                  {p.index} — {p.role}
                </span>
              </div>
              {p.bio ? <p className="elm-muted" style={{ margin: 0 }}>{p.bio}</p> : null}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
