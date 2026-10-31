'use client';

import type { ReactNode } from 'react';
import { Blossom, BlossomBranch } from './Blossom';

type Tone = 'blush' | 'rose' | 'ivory' | 'peach';
type FlowerProps = { x: number; y: number; s?: number; r?: number; tone?: Tone };

const EDGE: Record<Tone, string> = { blush: '#d47590', rose: '#8e2440', ivory: '#c8a885', peach: '#de8379' };

/** Petal outlines with the base at (0,0) and the tip toward -y. */
const RUFFLE =
  'M0 0 C -16 -6 -27 -26 -21 -42 C -17 -49 -11 -44 -7 -50 C -3 -55 3 -55 7 -50 C 11 -44 17 -49 21 -42 C 27 -26 16 -6 0 0 Z';
const ROUND = 'M0 0 C -22 -5 -27 -32 -13 -42 C -5 -47 5 -47 13 -42 C 27 -32 22 -5 0 0 Z';
const CUP = 'M-14 0 C -14 -14 -6 -20 0 -20 C 6 -20 14 -14 14 0 C 8 -5 -8 -5 -14 0 Z';
const LEAF = 'M0 0 C 12 -14 13 -38 0 -58 C -13 -38 -12 -14 0 0 Z';
const VEIN = 'M0 -3 Q -1.5 -20 0 -38';

/** Deterministic wobble so every render (server and client) draws the same flower. */
const jitter = (i: number, spread: number) => ((((i * 47) % 13) / 12) - 0.5) * spread;
/** Rounded so server and browser trig never disagree in the last digit during hydration. */
const polar = (deg: number, dist: number) => ({
  x: (Math.cos((deg * Math.PI) / 180) * dist).toFixed(2),
  y: (Math.sin((deg * Math.PI) / 180) * dist).toFixed(2),
});

function petalGradient(id: string, stops: [string, string, string, string]) {
  return (
    <radialGradient id={id} cx="50%" cy="100%" r="105%" fx="50%" fy="100%">
      <stop offset="0%" stopColor={stops[0]} />
      <stop offset="30%" stopColor={stops[1]} />
      <stop offset="72%" stopColor={stops[2]} />
      <stop offset="100%" stopColor={stops[3]} />
    </radialGradient>
  );
}

/** Shared gradients for every flower; render once per page, before any flower. */
export function FloraDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        {petalGradient('elm-fg-blush', ['#c24c6c', '#ec93aa', '#fad2db', '#fff5f7'])}
        {petalGradient('elm-fg-rose', ['#6e1229', '#b5344f', '#e47f96', '#f8c6d0'])}
        {petalGradient('elm-fg-ivory', ['#c39b74', '#e8d3ba', '#f8eee2', '#fffdf8'])}
        {petalGradient('elm-fg-peach', ['#d0616f', '#f09d9f', '#fbd0c5', '#fff4ee'])}
        {petalGradient('elm-fg-blossom', ['#d95d7c', '#f3a3b6', '#fcdbe3', '#fff6f8'])}
        <linearGradient id="elm-fg-leaf" x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0%" stopColor="#38513a" />
          <stop offset="55%" stopColor="#6f8c62" />
          <stop offset="100%" stopColor="#a8be92" />
        </linearGradient>
        <linearGradient id="elm-fg-euca" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#5f7d76" />
          <stop offset="60%" stopColor="#9db8b0" />
          <stop offset="100%" stopColor="#d0dfd9" />
        </linearGradient>
        {petalGradient('elm-fg-hydra-a', ['#7a6fb8', '#a79dd9', '#d6d0f1', '#f5f3fd'])}
        {petalGradient('elm-fg-hydra-b', ['#6f8fc4', '#9fb8e2', '#d3e0f4', '#f4f8fe'])}
        <linearGradient id="elm-fg-daisy" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#d9d3c8" />
          <stop offset="35%" stopColor="#f6f3ee" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <radialGradient id="elm-fg-core" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff2c2" />
          <stop offset="55%" stopColor="#e6b14a" />
          <stop offset="100%" stopColor="#9c6a1c" />
        </radialGradient>
        <radialGradient id="elm-fg-shade">
          <stop offset="0%" stopColor="#4a0f20" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#4a0f20" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

type Ring = { n: number; k: number; off: number };

function Rings({ rings, d, tone, seed }: { rings: Ring[]; d: string; tone: Tone; seed: number }) {
  const fill = `url(#elm-fg-${tone})`;
  return (
    <>
      {rings.map((ring, ri) => (
        <g key={ri}>
          {ri > 0 ? <circle r={44 * ring.k + 8} fill="url(#elm-fg-shade)" /> : null}
          {Array.from({ length: ring.n }, (_, i) => {
            const angle = (360 / ring.n) * i + ring.off + jitter(i + ri * 5 + seed, 16);
            const k = ring.k * (1 + jitter(i * 3 + ri + seed, 0.18));
            // Uneven width and a slight skew keep the petals from looking stamped out.
            const ky = k * (0.86 + (((i + seed) * 31) % 7) * 0.03);
            const skew = jitter(i * 5 + ri * 2 + seed, 14);
            return (
              <g key={i} transform={`rotate(${angle.toFixed(2)}) skewX(${skew.toFixed(2)}) scale(${k.toFixed(3)} ${ky.toFixed(3)})`}>
                <path d={d} fill={fill} stroke={EDGE[tone]} strokeWidth={0.6} strokeOpacity={0.45} />
                <path d={VEIN} fill="none" stroke="#fff" strokeOpacity={0.32} strokeWidth={0.9} />
              </g>
            );
          })}
        </g>
      ))}
    </>
  );
}

/** Full, ruffled peony seen at a three-quarter angle. */
export function Peony({ x, y, s = 1, r = 0, tone = 'blush' }: FlowerProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s} ${s * 0.88})`}>
      <Rings
        d={RUFFLE}
        tone={tone}
        seed={Math.round(x + y)}
        rings={[
          { n: 9, k: 1, off: 0 },
          { n: 8, k: 0.8, off: 22 },
          { n: 7, k: 0.6, off: 9 },
          { n: 6, k: 0.42, off: 31 },
        ]}
      />
      <circle r={11} fill="url(#elm-fg-shade)" />
      {[0, 72, 144, 216, 288].map((a, i) => (
        <path
          key={a}
          d={CUP}
          transform={`rotate(${a + jitter(i, 24)}) translate(0 2) scale(${(0.55 + jitter(i, 0.12)).toFixed(3)})`}
          fill={`url(#elm-fg-${tone})`}
          stroke={EDGE[tone]}
          strokeWidth={0.5}
          strokeOpacity={0.55}
        />
      ))}
      {[20, 95, 160, 230, 300].map((a) => (
        <circle key={a} cx={polar(a, 4).x} cy={polar(a, 4).y} r={1.4} fill="url(#elm-fg-core)" />
      ))}
    </g>
  );
}

/** Garden rose: rounded petals closing into a spiral heart. */
export function Rose({ x, y, s = 1, r = 0, tone = 'rose' }: FlowerProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s} ${s * 0.9})`}>
      <Rings
        d={ROUND}
        tone={tone}
        seed={Math.round(x * 2 + y)}
        rings={[
          { n: 6, k: 1, off: 0 },
          { n: 5, k: 0.78, off: 36 },
          { n: 5, k: 0.56, off: 12 },
          { n: 4, k: 0.38, off: 50 },
        ]}
      />
      <circle r={9} fill={`url(#elm-fg-${tone})`} />
      <path
        d="M-1 3 C -9 1 -8 -9 0 -9 C 7 -9 8 -1 2 2 C -3 4 -5 -2 -1 -4 C 2 -5 3 -2 1 -1"
        fill="none"
        stroke={EDGE[tone]}
        strokeWidth={1.3}
        strokeLinecap="round"
        opacity={0.75}
      />
    </g>
  );
}

const HYDRA_PETAL = 'M0 0 C -5 -2 -6.5 -8 0 -10.5 C 6.5 -8 5 -2 0 0 Z';
const HYDRA_FLORETS = Array.from({ length: 26 }, (_, i) => {
  const dist = 38 * Math.sqrt((i + 0.5) / 26);
  const theta = i * 2.39996;
  return { i, x: Math.cos(theta) * dist, y: Math.sin(theta) * dist, dist };
}).reverse();

/** Hydrangea dome: outer florets first so the centre sits on top and reads as a rounded head. */
export function Hydrangea({ x, y, s = 1, r = 0 }: Omit<FlowerProps, 'tone'>) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s} ${s * 0.9})`}>
      <circle r={46} fill="url(#elm-fg-shade)" />
      {HYDRA_FLORETS.map(({ i, x: fx, y: fy, dist }) => {
        const fill = i % 3 === 0 ? 'url(#elm-fg-hydra-b)' : 'url(#elm-fg-hydra-a)';
        const k = 1.05 - (dist / 38) * 0.25;
        return (
          <g key={i} transform={`translate(${fx.toFixed(2)} ${fy.toFixed(2)}) rotate(${(i * 23) % 90}) scale(${k.toFixed(3)})`}>
            {[0, 90, 180, 270].map((a) => (
              <path key={a} d={HYDRA_PETAL} transform={`rotate(${a})`} fill={fill} stroke="#6c62a8" strokeOpacity={0.3} strokeWidth={0.4} />
            ))}
            <circle r={1.3} fill="#f7f1ff" stroke="#8f84c6" strokeWidth={0.4} />
          </g>
        );
      })}
    </g>
  );
}

/** Cúc họa mi (field daisy): fine white petals around a golden centre. */
export function Daisy({ x, y, s = 1, r = 0, tilt = 1 }: Omit<FlowerProps, 'tone'> & { tilt?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s} ${s * tilt})`}>
      {Array.from({ length: 18 }, (_, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={-13}
          rx={2.7}
          ry={10.5 + (i % 3)}
          transform={`rotate(${i * 20 + jitter(i, 8)})`}
          fill="url(#elm-fg-daisy)"
          stroke="#d6cfc3"
          strokeWidth={0.4}
        />
      ))}
      <circle r={6.4} fill="url(#elm-fg-core)" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle key={a} cx={polar(a, 3.6).x} cy={polar(a, 3.6).y} r={0.8} fill="#a8741e" opacity={0.6} />
      ))}
    </g>
  );
}

export function Leaf({ x, y, s = 1, r = 0 }: Omit<FlowerProps, 'tone'>) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d={LEAF} fill="url(#elm-fg-leaf)" />
      <path d="M0 -2 Q 1.5 -28 0 -54" fill="none" stroke="#e6eedb" strokeOpacity={0.5} strokeWidth={0.9} />
      <path d="M0 -14 L -6 -20 M0 -24 L 7 -31 M0 -34 L -6 -40" fill="none" stroke="#e6eedb" strokeOpacity={0.3} strokeWidth={0.6} />
    </g>
  );
}

const EUCA_LEAVES: [number, number, number][] = [
  [0, -12, 1],
  [-3, -32, 0.95],
  [3, -52, 0.86],
  [-2, -72, 0.75],
  [2, -90, 0.62],
  [0, -104, 0.5],
];

/** Silver-dollar eucalyptus stem. */
export function Eucalyptus({ x, y, s = 1, r = 0 }: Omit<FlowerProps, 'tone'>) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0 C 4 -30 -4 -70 0 -112" fill="none" stroke="#6b7f6f" strokeWidth={1.6} strokeLinecap="round" />
      {EUCA_LEAVES.map(([lx, ly, k], i) => {
        const side = i % 2 ? 1 : -1;
        return (
          <ellipse
            key={i}
            cx={lx + side * 11 * k}
            cy={ly}
            rx={11 * k}
            ry={9 * k}
            fill="url(#elm-fg-euca)"
            stroke="#55716a"
            strokeOpacity={0.35}
            strokeWidth={0.6}
            transform={`rotate(${side * 18} ${lx} ${ly})`}
          />
        );
      })}
    </g>
  );
}

const GYP_TIPS: [number, number][] = [
  [-26, -58],
  [-12, -74],
  [4, -82],
  [18, -66],
  [30, -50],
  [-34, -38],
  [10, -46],
];
const GYP_FLORETS: [number, number][] = [
  [0, 0],
  [4, -3],
  [-4, -2],
  [2, 4],
  [-3, 4],
];

/** Baby's breath: airy sprays of tiny white florets. */
export function Gypsophila({ x, y, s = 1, r = 0 }: Omit<FlowerProps, 'tone'>) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      {GYP_TIPS.map(([tx, ty], i) => (
        <path key={i} d={`M0 0 Q ${tx * 0.3} ${ty * 0.6} ${tx} ${ty}`} fill="none" stroke="#8b9a7b" strokeWidth={0.8} />
      ))}
      {GYP_TIPS.map(([tx, ty], i) => (
        <g key={i} transform={`translate(${tx} ${ty})`}>
          {GYP_FLORETS.map(([fx, fy], j) => (
            <g key={j}>
              <circle cx={fx} cy={fy} r={2.5 - (j % 2) * 0.5} fill="#fffaf4" stroke="#e2d4c1" strokeWidth={0.4} />
              <circle cx={fx} cy={fy} r={0.7} fill="#e5d3a8" />
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

function Art({ viewBox, children }: { viewBox: string; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

export function PeonyCluster() {
  return (
    <Art viewBox="0 20 340 300">
      <Eucalyptus x={60} y={300} s={1.4} r={-42} />
      <Eucalyptus x={292} y={290} s={1.2} r={52} />
      <Leaf x={150} y={210} s={1.4} r={-150} />
      <Leaf x={196} y={214} s={1.35} r={160} />
      <Leaf x={120} y={232} s={1.4} r={-70} />
      <Leaf x={232} y={222} s={1.3} r={72} />
      <Leaf x={92} y={160} s={1.1} r={-104} />
      <Leaf x={262} y={140} s={1} r={102} />
      <Gypsophila x={46} y={226} s={1.1} r={-52} />
      <Gypsophila x={302} y={206} s={1} r={56} />
      <Hydrangea x={248} y={206} s={0.82} r={10} />
      <Peony x={108} y={118} s={0.82} tone="ivory" r={20} />
      <Rose x={246} y={104} s={0.88} r={-10} />
      <Daisy x={88} y={236} s={1.05} r={-20} tilt={0.8} />
      <Daisy x={128} y={268} s={0.85} r={14} tilt={0.65} />
      <Peony x={172} y={170} s={1.28} tone="blush" />
      <Blossom x={292} y={150} r={0.95} rotate={14} />
      <Blossom x={58} y={88} r={0.8} rotate={-20} />
    </Art>
  );
}

export function RoseSpray() {
  return (
    <Art viewBox="0 0 300 280">
      <Eucalyptus x={40} y={272} s={1.3} r={-32} />
      <Leaf x={100} y={202} s={1.3} r={-62} />
      <Leaf x={212} y={212} s={1.2} r={62} />
      <Leaf x={150} y={242} s={1.1} r={0} />
      <Leaf x={140} y={190} s={1.2} r={-160} />
      <Gypsophila x={252} y={152} s={1} r={42} />
      <Hydrangea x={74} y={176} s={0.7} r={-12} />
      <Rose x={192} y={108} s={0.8} tone="ivory" r={15} />
      <Rose x={130} y={150} s={1.15} tone="rose" />
      <Peony x={226} y={192} s={0.6} tone="peach" r={30} />
      <Daisy x={166} y={236} s={0.9} r={18} tilt={0.75} />
      <Blossom x={70} y={110} r={1} rotate={8} />
    </Art>
  );
}

/** Cúc họa mi meadow with baby's breath and eucalyptus: light and airy, good for the far layer. */
export function MeadowSpray() {
  return (
    <Art viewBox="0 0 280 280">
      <Eucalyptus x={140} y={276} s={1.5} r={-28} />
      <Eucalyptus x={150} y={276} s={1.3} r={32} />
      {[
        [96, 120, 1.1, -24, 0.9],
        [150, 90, 1.25, 6, 0.95],
        [196, 132, 1, 26, 0.8],
        [124, 168, 0.9, -8, 0.7],
        [178, 186, 0.8, 18, 0.65],
        [70, 196, 0.75, -30, 0.7],
      ].map(([dx, dy, s, r, tilt], i) => (
        <g key={i}>
          <path d={`M140 276 Q ${(140 + dx) / 2} ${(276 + dy) / 2 + 30} ${dx} ${dy + 6}`} fill="none" stroke="#7d8f6c" strokeWidth={1.1} />
          <Daisy x={dx} y={dy} s={s} r={r} tilt={tilt} />
        </g>
      ))}
      <Gypsophila x={130} y={262} s={1.4} r={-30} />
      <Gypsophila x={150} y={262} s={1.3} r={34} />
    </Art>
  );
}

export function HydrangeaBunch() {
  return (
    <Art viewBox="0 0 260 240">
      <Leaf x={130} y={150} s={1.5} r={-120} />
      <Leaf x={130} y={150} s={1.4} r={124} />
      <Leaf x={130} y={150} s={1.2} r={180} />
      <Hydrangea x={92} y={112} s={1.05} r={-8} />
      <Hydrangea x={170} y={100} s={0.95} r={14} />
      <Rose x={136} y={150} s={0.62} tone="ivory" r={20} />
      <Gypsophila x={84} y={176} s={0.9} r={-48} />
      <Gypsophila x={180} y={172} s={0.85} r={50} />
    </Art>
  );
}

export function AirySpray() {
  return (
    <Art viewBox="0 0 260 260">
      <Eucalyptus x={126} y={256} s={1.6} r={-16} />
      <Eucalyptus x={150} y={256} s={1.4} r={26} />
      <Gypsophila x={120} y={242} s={1.5} r={-22} />
      <Gypsophila x={152} y={242} s={1.4} r={26} />
      <Gypsophila x={134} y={232} s={1.2} r={0} />
      <Blossom x={100} y={92} r={0.9} rotate={10} />
      <Blossom x={172} y={72} r={0.7} rotate={-30} />
    </Art>
  );
}

export function SingleBloom() {
  return (
    <Art viewBox="0 0 200 200">
      <Leaf x={100} y={104} s={1.35} r={-124} />
      <Leaf x={100} y={104} s={1.25} r={132} />
      <Leaf x={100} y={104} s={1} r={186} />
      <Gypsophila x={44} y={164} s={0.85} r={-62} />
      <Peony x={100} y={100} s={1.2} tone="blush" r={12} />
    </Art>
  );
}

export function BranchArt() {
  return <BlossomBranch />;
}
