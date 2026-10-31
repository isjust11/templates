'use client';

import type { CSSProperties } from 'react';

/** Peach petal with the notched tip real blossoms have; base at (0,0), tip toward -y. */
const PETAL = 'M0 0 C -11 -5 -14 -21 -7 -27 Q -3 -30 0 -25 Q 3 -30 7 -27 C 14 -21 11 -5 0 0 Z';
const PETAL_VEIN = 'M0 -2 Q -1 -12 0 -22 M0 -4 Q -5 -12 -6 -19 M0 -4 Q 5 -12 6 -19';

/** Five-petal peach blossom drawn around (0,0); gradients come from `FloraDefs`. */
export function Blossom({
  x,
  y,
  r = 1,
  rotate = 0,
  deep = '#e07a93',
}: {
  x: number;
  y: number;
  r?: number;
  rotate?: number;
  deep?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${r})`}>
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <g key={angle} transform={`rotate(${angle + ((i * 7) % 5) * 2 - 4}) scale(${1 - (i % 3) * 0.05})`}>
          <path d={PETAL} fill="url(#elm-fg-blossom)" stroke={deep} strokeWidth="0.5" strokeOpacity="0.55" />
          <path d={PETAL_VEIN} fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="0.5" />
        </g>
      ))}
      <circle r="6.5" fill="url(#elm-fg-shade)" />
      <circle r="3.6" fill="#c84f6c" />
      {[0, 30, 60, 100, 140, 180, 215, 250, 290, 325].map((angle, i) => {
        const len = 8 + (i % 3) * 1.6;
        return (
          <g key={angle} transform={`rotate(${angle})`}>
            <line x1="0" y1="-2" x2="0" y2={-len} stroke="#f3dfe3" strokeWidth="0.55" />
            <circle cx="0" cy={-len - 0.6} r="1.15" fill="url(#elm-fg-core)" />
          </g>
        );
      })}
    </g>
  );
}

function Bud({ x, y, rotate }: { x: number; y: number; rotate: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d="M0 0 C -6 -4 -6 -13 0 -17 C 6 -13 6 -4 0 0 Z" fill="url(#elm-fg-blossom)" stroke="#d9667f" strokeWidth="0.5" />
      <path d="M0 0 C -4 -2 -6 -6 -5 -8 M0 0 C 4 -2 6 -6 5 -8" stroke="#6d4a2f" strokeWidth="1.3" strokeLinecap="round" fill="none" />
    </g>
  );
}

/**
 * Peach-blossom branch growing from the top-left corner. Mirror it with `flip` for the right
 * corner; the parent decides size and position.
 */
export function BlossomBranch({ flip = false, className, style }: { flip?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <svg
      className={className}
      style={{ ...style, transform: `${style?.transform ?? ''} ${flip ? 'scaleX(-1)' : ''}`.trim() || undefined }}
      viewBox="0 0 260 220"
      aria-hidden="true"
    >
      <path
        d="M-10 18 C 40 30 70 52 104 70 C 140 90 170 96 214 132 M70 50 C 80 80 78 110 92 150 M150 92 C 170 70 196 62 232 58 M104 70 C 120 58 128 40 126 18"
        fill="none"
        stroke="#4e3020"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M-10 18 C 40 30 70 52 104 70 C 140 90 170 96 214 132 M150 92 C 170 70 196 62 232 58"
        fill="none"
        stroke="#9a6a44"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.6"
        transform="translate(0 -1.4)"
      />
      <Blossom x={60} y={44} r={1.05} rotate={12} />
      <Blossom x={118} y={80} r={1.25} rotate={-8} />
      <Blossom x={92} y={146} r={0.85} rotate={30} />
      <Blossom x={190} y={112} r={0.95} rotate={20} />
      <Blossom x={226} y={58} r={0.75} rotate={-18} />
      <Blossom x={126} y={22} r={0.7} rotate={40} />
      <Bud x={214} y={134} rotate={130} />
      <Bud x={84} y={116} rotate={-150} />
      <Bud x={160} y={88} rotate={-20} />
      <Bud x={30} y={26} rotate={-60} />
    </svg>
  );
}
