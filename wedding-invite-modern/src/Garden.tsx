'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, type CSSProperties, type ComponentType } from 'react';
import { useModern } from './context';
import { AirySpray, BranchArt, HydrangeaBunch, MeadowSpray, PeonyCluster, RoseSpray, SingleBloom } from './Flora';
import { EASE } from './Reveal';

type Depth = 'far' | 'mid' | 'near';
type Kind = 'peony' | 'rose' | 'airy' | 'meadow' | 'hydrangea' | 'bloom' | 'branch';

type Spot = {
  kind: Kind;
  depth: Depth;
  /** Anchor with exactly one of left/right so small screens can push the art outward. */
  at: Pick<CSSProperties, 'top' | 'bottom' | 'left' | 'right'>;
  width: string;
  rotate?: number;
  flip?: boolean;
};

export type GardenPreset = 'hero' | 'invitation' | 'couple' | 'events' | 'gifts' | 'rsvp' | 'footer';

const ART: Record<Kind, ComponentType> = {
  peony: PeonyCluster,
  rose: RoseSpray,
  airy: AirySpray,
  meadow: MeadowSpray,
  hydrangea: HydrangeaBunch,
  bloom: SingleBloom,
  branch: BranchArt,
};

const PRESETS: Record<GardenPreset, Spot[]> = {
  hero: [
    { kind: 'rose', depth: 'far', at: { top: '16%', left: '-10%' }, width: 'clamp(200px, 34vw, 420px)', rotate: -20 },
    { kind: 'meadow', depth: 'far', at: { bottom: '2%', left: '30%' }, width: 'clamp(160px, 24vw, 300px)', rotate: 8 },
  ],
  invitation: [
    { kind: 'airy', depth: 'far', at: { top: '0%', left: '-4%' }, width: 'clamp(180px, 30vw, 360px)', rotate: -12 },
    { kind: 'peony', depth: 'mid', at: { top: '6%', right: '-6%' }, width: 'clamp(220px, 34vw, 440px)', rotate: 12, flip: true },
    { kind: 'rose', depth: 'mid', at: { bottom: '4%', left: '-8%' }, width: 'clamp(200px, 30vw, 400px)', rotate: -8 },
    { kind: 'bloom', depth: 'near', at: { bottom: '1%', right: '3%' }, width: 'clamp(110px, 16vw, 200px)', rotate: 20 },
  ],
  couple: [
    { kind: 'hydrangea', depth: 'far', at: { top: '18%', right: '-6%' }, width: 'clamp(180px, 28vw, 340px)', rotate: 15, flip: true },
    { kind: 'rose', depth: 'mid', at: { bottom: '6%', left: '-10%' }, width: 'clamp(200px, 30vw, 380px)', rotate: -15 },
  ],
  events: [
    { kind: 'peony', depth: 'mid', at: { top: '-4%', left: '-8%' }, width: 'clamp(200px, 30vw, 400px)', rotate: -20 },
    { kind: 'meadow', depth: 'far', at: { bottom: '4%', right: '-6%' }, width: 'clamp(180px, 26vw, 320px)', flip: true },
  ],
  gifts: [
    { kind: 'branch', depth: 'mid', at: { top: '0%', left: '0%' }, width: 'clamp(180px, 26vw, 300px)' },
    { kind: 'hydrangea', depth: 'far', at: { bottom: '0%', right: '-4%' }, width: 'clamp(160px, 24vw, 300px)', flip: true },
  ],
  rsvp: [
    { kind: 'airy', depth: 'far', at: { top: '6%', left: '-6%' }, width: 'clamp(160px, 24vw, 300px)' },
    { kind: 'hydrangea', depth: 'mid', at: { bottom: '6%', right: '-8%' }, width: 'clamp(220px, 32vw, 420px)', rotate: 10, flip: true },
  ],
  footer: [
    { kind: 'meadow', depth: 'far', at: { top: '4%', left: '38%' }, width: 'clamp(160px, 22vw, 280px)' },
    { kind: 'peony', depth: 'mid', at: { bottom: '-6%', left: '-8%' }, width: 'clamp(220px, 32vw, 440px)', rotate: -10 },
    { kind: 'rose', depth: 'mid', at: { bottom: '-6%', right: '-8%' }, width: 'clamp(200px, 30vw, 400px)', rotate: 12, flip: true },
  ],
};

function SpotView({ spot, index, y }: { spot: Spot; index: number; y: MotionValue<number> }) {
  const Art = ART[spot.kind];
  const side = spot.at.left !== undefined ? 'left' : 'right';
  return (
    <motion.div
      className={`elm-flora__spot elm-flora__spot--${spot.depth} elm-flora__spot--${side}`}
      style={{ ...spot.at, width: spot.width, y }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1.8, delay: index * 0.15, ease: EASE }}
    >
      <div className="elm-flora__art" style={{ transform: `rotate(${spot.rotate ?? 0}deg) scaleX(${spot.flip ? -1 : 1})` }}>
        <div className="elm-flora__sway" style={{ animationDelay: `${-index * 1.7}s`, animationDuration: `${7 + index * 1.3}s` }}>
          <Art />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Flowers behind (and a few in front of) a section's content at three depths. Far art is blurred
 * and drifts slower than the page, near art is sharp and drifts faster, which reads as depth.
 */
export default function Garden({ preset }: { preset: GardenPreset }) {
  const { lowPower } = useModern();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const amp = lowPower ? 0 : 1;
  const far = useTransform(scrollYProgress, [0, 1], [-70 * amp, 70 * amp]);
  const mid = useTransform(scrollYProgress, [0, 1], [-24 * amp, 24 * amp]);
  const near = useTransform(scrollYProgress, [0, 1], [140 * amp, -140 * amp]);
  const offsets: Record<Depth, MotionValue<number>> = { far, mid, near };

  const spots = PRESETS[preset];
  const back = spots.filter((s) => s.depth !== 'near');
  const front = spots.filter((s) => s.depth === 'near');

  return (
    <>
      <div ref={ref} className="elm-flora elm-flora--back" aria-hidden="true">
        {back.map((spot, i) => (
          <SpotView key={i} spot={spot} index={i} y={offsets[spot.depth]} />
        ))}
      </div>
      {front.length ? (
        <div className="elm-flora elm-flora--front" aria-hidden="true">
          {front.map((spot, i) => (
            <SpotView key={i} spot={spot} index={back.length + i} y={offsets[spot.depth]} />
          ))}
        </div>
      ) : null}
    </>
  );
}
