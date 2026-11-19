'use client';

import { useModern } from './context';
import { list, text } from './fields';
import Reveal from './Reveal';

export default function DressCode() {
  const { data, t } = useModern();
  const note = text(data.dressCodeNote);
  const colors = list<string>(data.dressCodeColors).map((c) => text(c)).filter(Boolean);
  if (!note && !colors.length) return null;

  return (
    <section className="elm-section" id="dress-code" style={{ paddingTop: 0 }}>
      <Reveal className="elm-narrow" style={{ textAlign: 'center' }}>
        <span className="elm-eyebrow">{t.dressCode}</span>
        {note ? (
          <p className="elm-quote" style={{ margin: '20px 0 0', fontSize: 'clamp(22px, 3.6vw, 32px)' }}>
            {note}
          </p>
        ) : null}
        {colors.length ? (
          <div className="elm-swatches">
            {colors.map((color) => (
              <span key={color} className="elm-swatch" style={{ background: color }} title={color} />
            ))}
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}
