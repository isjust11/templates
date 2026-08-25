'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTemplateData } from './TemplateDataProvider';

function Word({
  word,
  progress,
  range,
  bold,
}: {
  word: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  range: [number, number];
  bold?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [4, 0]);

  return (
    <motion.span
      style={{ opacity, y, display: 'inline-block' }}
      className={`mr-[0.3em] text-sage-800 transition-colors${bold ? ' font-semibold' : ''}`}
    >
      {word}
    </motion.span>
  );
}

export default function WelcomeMessage() {
  const { welcomeLines, welcomeHighlightLineIndex } = useTemplateData();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.8'],
  });

  const allWords = welcomeLines.flatMap((line, lineIndex) =>
    line === ''
      ? [{ text: '\n', lineIndex }]
      : line.split(' ').map((w) => ({ text: w, lineIndex }))
  );
  const totalWords = allWords.filter((w) => w.text !== '\n').length;

  let wordIndex = 0;

  return (
    <section ref={ref} className="py-32 px-6 bg-cream-50" data-slot="text.welcomeLines">
      <div className="max-w-4xl mx-auto text-center">
        <div className="font-display text-4xl md:text-6xl lg:text-7xl leading-snug md:leading-snug text-sage-800">
          {allWords.map((entry, i) => {
            if (entry.text === '\n') {
              return <div key={`br-${i}`} className="h-6 md:h-10" />;
            }

            const currentIndex = wordIndex;
            wordIndex++;

            const start = currentIndex / totalWords;
            const end = (currentIndex + 1) / totalWords;

            return (
              <Word
                key={`${entry.text}-${i}`}
                word={entry.text}
                progress={scrollYProgress}
                range={[start, end]}
                bold={entry.lineIndex === welcomeHighlightLineIndex}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
