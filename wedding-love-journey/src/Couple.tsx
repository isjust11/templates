'use client';

import { useJourney } from './context';
import { fieldStyle, text } from './fields';
import { Fade, SectionTitle } from './ui';

export default function Couple() {
  const { data, t, groom, bride } = useJourney();
  const groomPhoto = text(data.groomPhoto);
  const bridePhoto = text(data.bridePhoto);
  const intro = text(data.coupleIntro);
  if (!groomPhoto && !bridePhoto && !intro) return null;

  return (
    <section className="lj-section lj-couple" id="lj-couple">
      <SectionTitle>{t.theCouple}</SectionTitle>
      <div className="lj-couple__grid">
        {[
          { photo: groomPhoto, name: groom, role: t.groom, field: data.groomPhoto, nameField: data.groomName },
          { photo: bridePhoto, name: bride, role: t.bride, field: data.bridePhoto, nameField: data.brideName },
        ].map((person, i) => (
          <Fade key={person.role} delay={i * 0.15} className="lj-person">
            <div className="lj-frame lj-person__photo">
              {person.photo ? <img src={person.photo} alt={person.name} loading="lazy" style={fieldStyle(person.field)} /> : null}
            </div>
            <span className="lj-person__line" aria-hidden="true" />
            <p className="lj-person__role">{person.role}</p>
            <p className="lj-person__name" style={fieldStyle(person.nameField)}>
              {person.name}
            </p>
          </Fade>
        ))}
      </div>
      {intro ? (
        <Fade delay={0.2}>
          <p className="lj-couple__intro" style={fieldStyle(data.coupleIntro)}>
            {intro}
          </p>
        </Fade>
      ) : null}
    </section>
  );
}
