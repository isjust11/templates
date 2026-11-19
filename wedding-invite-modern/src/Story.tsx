'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { useModern } from './context';
import { imageUrl, list, text, type StoryItem } from './fields';
import Reveal, { FadeImage, LineReveal } from './Reveal';

export default function Story() {
  const { data } = useModern();
  const items = list<StoryItem>(data.story).filter((item) => text(item?.title));
  // Split so the scroll hook always has a mounted target.
  return items.length ? <StoryTimeline items={items} /> : null;
}

function StoryTimeline({ items }: { items: StoryItem[] }) {
  const { t } = useModern();
  const trackRef = useRef<HTMLDivElement>(null);
  // Timeline line draws itself as the guest scrolls through the story.
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 75%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section className="elm-section" id="story">
      <div className="elm-container">
        <div className="elm-head">
          <span className="elm-eyebrow">{t.journey}</span>
          <h2 className="elm-display elm-h2">
            <LineReveal>{t.ourStory}</LineReveal>
          </h2>
        </div>
        <div className="elm-story" ref={trackRef}>
          <span className="elm-story__track" aria-hidden="true" />
          <motion.span className="elm-story__progress" style={{ scaleY: progress }} aria-hidden="true" />
          {items.map((item, i) => {
            const image = imageUrl(item.image);
            return (
              <Reveal key={i} className="elm-story__item">
                <span className="elm-story__dot" aria-hidden="true" />
                <span className="elm-story__date">{text(item.date)}</span>
                <div>
                  <h3 className="elm-story__title">{text(item.title)}</h3>
                  {text(item.description) ? (
                    <p className="elm-muted" style={{ margin: 0 }}>
                      {text(item.description)}
                    </p>
                  ) : null}
                </div>
                {image ? (
                  <div className="elm-story__img">
                    <FadeImage src={image} alt={text(item.title)} />
                  </div>
                ) : (
                  <span />
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
