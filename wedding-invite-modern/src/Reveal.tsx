'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

/** Fade-up on first scroll into view. Reduced motion is handled by the root `MotionConfig`. */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Mask padding keeps Vietnamese diacritics and descenders inside the clip. */
const MASK: CSSProperties = { overflow: 'hidden', paddingTop: '0.14em', marginTop: '-0.14em', paddingBottom: '0.08em', marginBottom: '-0.08em' };

/**
 * Mask-reveal for large display lines. The in-view trigger sits on the visible mask, not on the
 * translated line: a line pushed outside its `overflow: hidden` parent never intersects.
 */
export function LineReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.span
      style={{ display: 'block', ...MASK }}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true }}
    >
      <motion.span
        style={{ display: 'block' }}
        variants={{
          hidden: { y: '105%' },
          shown: { y: '0%', transition: { duration: 1.2, delay, ease: EASE } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/**
 * Letters rise one by one inside a per-word mask. Driven by `play` (not in-view) so the hero
 * can wait for the gate to leave.
 */
export function SplitText({
  text,
  play,
  delay = 0,
  stagger = 0.035,
  style,
}: {
  text: string;
  play: boolean;
  delay?: number;
  stagger?: number;
  style?: CSSProperties;
}) {
  const words = text.normalize('NFC').split(/\s+/).filter(Boolean);
  let index = 0;
  return (
    <motion.span
      style={{ display: 'block', ...style }}
      aria-label={text}
      initial="hidden"
      animate={play ? 'shown' : 'hidden'}
    >
      {words.map((word, w) => (
        <span key={w} aria-hidden="true" style={{ display: 'inline-block', whiteSpace: 'nowrap', ...MASK }}>
          {Array.from(word).map((char) => {
            const i = index++;
            return (
              <motion.span
                key={i}
                style={{ display: 'inline-block' }}
                variants={{
                  hidden: { y: '110%', opacity: 0 },
                  shown: { y: '0%', opacity: 1, transition: { duration: 1, delay: delay + i * stagger, ease: EASE } },
                }}
              >
                {char}
              </motion.span>
            );
          })}
          {w < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </motion.span>
  );
}

/** Left-to-right "ink" stroke for script words (ampersand, thank-you). */
export function InkReveal({
  children,
  play,
  delay = 0,
  duration = 1.6,
  style,
  className,
}: {
  children: ReactNode;
  /** Omit to trigger on scroll into view. */
  play?: boolean;
  delay?: number;
  duration?: number;
  style?: CSSProperties;
  className?: string;
}) {
  const trigger = play === undefined ? { whileInView: 'shown' as const, viewport: { once: true } } : { animate: play ? 'shown' : 'hidden' };
  return (
    <motion.span className={className} style={{ display: 'inline-block', ...style }} initial="hidden" {...trigger}>
      <motion.span
        style={{ display: 'inline-block', padding: '0.1em 0.12em', margin: '-0.1em -0.12em' }}
        variants={{
          hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0.4 },
          shown: { clipPath: 'inset(0 0% 0 0)', opacity: 1, transition: { duration, delay, ease: EASE_IN_OUT } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/** Image that fades in from a soft blur once decoded (cached images skip straight to sharp). */
export function FadeImage({
  src,
  alt,
  className,
  style,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, [src]);
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
        filter: loaded ? 'blur(0)' : 'blur(14px)',
        transform: loaded ? undefined : 'scale(1.04)',
        transition: 'opacity .9s ease, filter 1.1s ease, transform 1.4s cubic-bezier(.22,1,.36,1)',
      }}
    />
  );
}
