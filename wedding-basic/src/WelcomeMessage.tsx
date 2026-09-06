'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTemplateData } from './TemplateDataProvider';
import { getFieldValue, getFieldStyle } from './types';

function Word({
  word, progress, range, highlight,
}: {
  word: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  range: [number, number];
  highlight?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  const y = useTransform(progress, range, [6, 0]);
  const color = useTransform(progress, range, highlight ? ['#ffb3c3', '#a82046'] : ['#f7aab7', '#7d1f42']);

  return (
    <motion.span
      style={{ opacity, y, color, display: 'inline-block' }}
      className={`mr-[0.28em] transition-colors ${highlight ? 'italic' : ''}`}
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
    offset: ['start 0.85', 'end 0.75'],
  });

  const lines = getFieldValue(welcomeLines) || [];
  const allWords = lines.flatMap((line: string, lineIndex: number) =>
    line === ''
      ? [{ text: '\n', lineIndex }]
      : line.split(' ').map((w: string) => ({ text: w, lineIndex }))
  );
  const totalWords = allWords.filter((w) => w.text !== '\n').length;
  let wordIndex = 0;

  return (
    <section
      ref={ref}
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #fff5f7 0%, #ffffff 100%)' }}
      data-slot="text.welcomeLines"
    >
      {/* Decorative elements */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-3 opacity-30 pointer-events-none">
        {['✿', '❀', '✿'].map((f, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
            className="text-petal-300 text-2xl"
          >
            {f}
          </motion.span>
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center">
        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to right, transparent, #ffb3c3)' }} />
          <span className="font-script text-3xl text-petal-400">Lời mời</span>
          <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to left, transparent, #ffb3c3)' }} />
        </motion.div>

        <div className="font-display text-3xl md:text-5xl lg:text-6xl leading-relaxed" style={getFieldStyle(welcomeLines)}>
          {allWords.map((entry: { text: string; lineIndex: number }, i: number) => {
            if (entry.text === '\n') {
              return <div key={`br-${i}`} className="h-5 md:h-8" />;
            }
            const currentIndex = wordIndex++;
            const start = currentIndex / totalWords;
            const end = (currentIndex + 1) / totalWords;
            return (
              <Word
                key={`${entry.text}-${i}`}
                word={entry.text}
                progress={scrollYProgress}
                range={[start, end]}
                highlight={entry.lineIndex === welcomeHighlightLineIndex}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
