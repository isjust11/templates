import type { CSSProperties } from 'react';

/** Deterministic wobble so server and client render identical paths. */
const wobble = (i: number, spread: number) => (((i * 37 + 11) % 13) / 12 - 0.5) * spread;

/** Shared gradients; rendered once per invite so every motif can reference them by id. */
export function BotanicalDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="lj-petal" cx="50%" cy="100%" r="105%">
          <stop offset="0" stopColor="#e6ead8" />
          <stop offset=".35" stopColor="#fbfbf5" />
          <stop offset="1" stopColor="#ffffff" />
        </radialGradient>
        <radialGradient id="lj-petal-blush" cx="50%" cy="100%" r="105%">
          <stop offset="0" stopColor="#f1c9cf" />
          <stop offset=".5" stopColor="#fae6e8" />
          <stop offset="1" stopColor="#fffafa" />
        </radialGradient>
        <radialGradient id="lj-core" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#ffe48a" />
          <stop offset=".6" stopColor="#f0b93a" />
          <stop offset="1" stopColor="#c98b1d" />
        </radialGradient>
        <linearGradient id="lj-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9db488" />
          <stop offset=".55" stopColor="#6f8f5f" />
          <stop offset="1" stopColor="#4d6a45" />
        </linearGradient>
        <linearGradient id="lj-leaf-soft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c7d6b0" />
          <stop offset="1" stopColor="#8fa87c" />
        </linearGradient>
        <linearGradient id="lj-wing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff7d6" />
          <stop offset=".6" stopColor="#f6dc8a" />
          <stop offset="1" stopColor="#d9b25a" />
        </linearGradient>
        <linearGradient id="lj-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf6ee" />
          <stop offset="1" stopColor="#efe4d2" />
        </linearGradient>
        <linearGradient id="lj-heart" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f08a9b" />
          <stop offset="1" stopColor="#c23b55" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const PETAL = 'M0 0C-8-6-12-20-7-31C-4-37 4-37 7-31C12-20 8-6 0 0Z';

function Flower({
  x,
  y,
  scale = 1,
  rotate = 0,
  petals = 6,
  blush = false,
  tilt = 1,
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  petals?: number;
  blush?: boolean;
  /** < 1 squashes the bloom so it reads as turned away from the viewer. */
  tilt?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale} ${(scale * tilt).toFixed(3)})`}>
      {Array.from({ length: petals }, (_, i) => (
        <path
          key={i}
          d={PETAL}
          transform={`rotate(${((360 / petals) * i + wobble(i, 14)).toFixed(1)}) scale(${(1 + wobble(i + 3, 0.18)).toFixed(2)})`}
          fill={blush ? 'url(#lj-petal-blush)' : 'url(#lj-petal)'}
          stroke="#d5dac6"
          strokeWidth=".6"
        />
      ))}
      <circle r="7.5" fill="url(#lj-core)" />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={(Math.cos(a) * 8.6).toFixed(2)}
            cy={(Math.sin(a) * 8.6).toFixed(2)}
            r="1.15"
            fill="#b8801c"
          />
        );
      })}
      <circle cx="-2" cy="-2.4" r="2.2" fill="#fff3bf" opacity=".7" />
    </g>
  );
}

function Leaf({ x, y, rotate = 0, scale = 1, soft = false }: { x: number; y: number; rotate?: number; scale?: number; soft?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 0C9-11 25-15 44-12C30-3 14 3 0 0Z" fill={soft ? 'url(#lj-leaf-soft)' : 'url(#lj-leaf)'} />
      <path d="M2-.5C14-5 27-8.5 41-11.5" stroke="#e3ecd4" strokeWidth=".7" fill="none" opacity=".75" />
    </g>
  );
}

function Bud({ x, y, rotate = 0, scale = 1 }: { x: number; y: number; rotate?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 0C-5-5-5-14 0-19C5-14 5-5 0 0Z" fill="url(#lj-petal)" stroke="#d5dac6" strokeWidth=".6" />
      <path d="M0 1C-5-2-6-7-5-10C-2-6 2-6 5-10C6-7 5-2 0 1Z" fill="url(#lj-leaf)" />
    </g>
  );
}

/** Tiny yellow puffs, like mimosa between the blooms. */
function Puffs({ x, y, n = 7, scale = 1 }: { x: number; y: number; n?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {Array.from({ length: n }, (_, i) => (
        <circle
          key={i}
          cx={(wobble(i, 22) + (i % 3) * 3).toFixed(2)}
          cy={(wobble(i + 5, 18) - i * 1.4).toFixed(2)}
          r={(2 + ((i * 7) % 4) * 0.45).toFixed(2)}
          fill={i % 2 ? '#f3cf55' : '#f8df86'}
          stroke="#d7a93a"
          strokeWidth=".4"
        />
      ))}
    </g>
  );
}

/** Corner spray: white blooms with golden hearts on a curving stem. Anchored top-right. */
export function WildSpray({ className, style, mirrored = false }: { className?: string; style?: CSSProperties; mirrored?: boolean }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 240 220"
      aria-hidden="true"
      focusable="false"
    >
      <g transform={mirrored ? 'translate(240 0) scale(-1 1)' : undefined}>
        <path d="M244 -4C200 30 168 58 132 96S70 160 28 206" stroke="#6f8f5f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M168 60C176 82 186 96 204 108" stroke="#6f8f5f" strokeWidth="1.4" fill="none" />
        <path d="M118 112C104 104 92 102 76 104" stroke="#6f8f5f" strokeWidth="1.3" fill="none" />
        <path d="M78 150C86 166 88 180 86 196" stroke="#6f8f5f" strokeWidth="1.2" fill="none" />

        <Leaf x={214} y={14} rotate={150} scale={1.1} />
        <Leaf x={196} y={36} rotate={20} scale={0.9} soft />
        <Leaf x={150} y={74} rotate={165} scale={1.05} />
        <Leaf x={140} y={86} rotate={40} scale={0.85} soft />
        <Leaf x={100} y={128} rotate={190} scale={0.95} />
        <Leaf x={60} y={168} rotate={30} scale={0.8} soft />
        <Leaf x={44} y={186} rotate={200} scale={0.75} />

        <Puffs x={204} y={112} n={8} />
        <Puffs x={72} y={104} n={6} scale={0.9} />
        <Puffs x={128} y={44} n={5} scale={0.8} />

        <Flower x={168} y={58} scale={1.15} rotate={8} />
        <Flower x={112} y={110} scale={0.92} rotate={-14} tilt={0.82} />
        <Flower x={208} y={102} scale={0.62} rotate={30} blush />
        <Flower x={62} y={160} scale={0.7} rotate={22} tilt={0.75} />
        <Bud x={88} y={198} rotate={168} scale={0.95} />
        <Bud x={232} y={52} rotate={-110} scale={0.8} />
        <Bud x={26} y={204} rotate={-150} scale={0.7} />
      </g>
    </svg>
  );
}

/** Small olive sprig for panel corners and dividers. */
export function Sprig({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 120 60" aria-hidden="true" focusable="false">
      <path d="M4 54C34 44 62 34 116 8" stroke="#6f8f5f" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <Leaf x={26} y={46} rotate={-70} scale={0.55} />
      <Leaf x={28} y={46} rotate={130} scale={0.5} soft />
      <Leaf x={52} y={36} rotate={-62} scale={0.6} soft />
      <Leaf x={54} y={36} rotate={140} scale={0.55} />
      <Leaf x={80} y={24} rotate={-55} scale={0.55} />
      <Leaf x={82} y={24} rotate={145} scale={0.5} soft />
      <Flower x={110} y={11} scale={0.42} rotate={10} />
    </svg>
  );
}

export function HeartLine({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 20.5s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.6c0 5.7-7.5 10.3-7.5 10.3Z" strokeLinejoin="round" />
    </svg>
  );
}

/** Soft yellow butterfly; wings flap through CSS (`.lj-butterfly__wing`). */
export function Butterfly({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="-30 -26 60 50" aria-hidden="true" focusable="false">
      <g className="lj-butterfly__wing lj-butterfly__wing--l">
        <path d="M-1-2C-10-22-28-24-27-10C-26 0-14 2-1 1Z" fill="url(#lj-wing)" stroke="#b78f3c" strokeWidth=".7" />
        <path d="M-1 1C-12 4-22 12-17 19C-12 24-4 14-1 4Z" fill="url(#lj-wing)" stroke="#b78f3c" strokeWidth=".7" />
        <path d="M-4-2C-11-10-18-14-22-12" stroke="#c49a46" strokeWidth=".5" fill="none" />
        <circle cx="-19" cy="-12" r="2" fill="#e9c46a" opacity=".8" />
      </g>
      <g className="lj-butterfly__wing lj-butterfly__wing--r">
        <path d="M1-2C10-22 28-24 27-10C26 0 14 2 1 1Z" fill="url(#lj-wing)" stroke="#b78f3c" strokeWidth=".7" />
        <path d="M1 1C12 4 22 12 17 19C12 24 4 14 1 4Z" fill="url(#lj-wing)" stroke="#b78f3c" strokeWidth=".7" />
        <path d="M4-2C11-10 18-14 22-12" stroke="#c49a46" strokeWidth=".5" fill="none" />
        <circle cx="19" cy="-12" r="2" fill="#e9c46a" opacity=".8" />
      </g>
      <ellipse cx="0" cy="1" rx="1.6" ry="9" fill="#5b4a2a" />
      <path d="M0-7C-2-13-5-16-7-17M0-7C2-13 5-16 7-17" stroke="#5b4a2a" strokeWidth=".7" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Gift envelope with hearts lifting out of the open flap. */
export function GiftEnvelope({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 200 170" className={`lj-envelope${open ? ' is-open' : ''}`} aria-hidden="true" focusable="false">
      <ellipse cx="100" cy="160" rx="72" ry="6" fill="#5a785e" opacity=".12" />
      <g className="lj-envelope__hearts">
        <path className="lj-envelope__heart h1" d="M100 74s-14-8.6-14-19.2A7.8 7.8 0 0 1 100 50a7.8 7.8 0 0 1 14 4.8C114 65.4 100 74 100 74Z" fill="url(#lj-heart)" />
        <path className="lj-envelope__heart h2" d="M72 80s-9-5.5-9-12.3A5 5 0 0 1 72 64.6a5 5 0 0 1 9 3.1C81 74.5 72 80 72 80Z" fill="#f2a3b1" />
        <path className="lj-envelope__heart h3" d="M130 82s-8-4.9-8-11A4.5 4.5 0 0 1 130 68a4.5 4.5 0 0 1 8 3C138 77.1 130 82 130 82Z" fill="#e7798d" />
      </g>
      <path d="M30 70h140v80a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6Z" fill="url(#lj-paper)" stroke="#c9b79a" strokeWidth="1.2" />
      <path d="M30 150 92 106a14 14 0 0 1 16 0l62 44" fill="none" stroke="#d8c8ac" strokeWidth="1.2" />
      <path d="M30 72 100 122 170 72" fill="#f5ecdd" stroke="#c9b79a" strokeWidth="1.2" strokeLinejoin="round" />
      <path className="lj-envelope__flap" d="M30 72 100 22 170 72Z" fill="#efe2cc" stroke="#c9b79a" strokeWidth="1.2" strokeLinejoin="round" />
      <g transform="translate(100 112)">
        <circle r="13" fill="#7b2236" />
        <circle r="10" fill="none" stroke="#a3485b" strokeWidth="1" />
        <path d="M0 5s-6-3.7-6-8.2A3.3 3.3 0 0 1 0-5.3a3.3 3.3 0 0 1 6 2.1C6 1.3 0 5 0 5Z" fill="#f8dfe4" />
      </g>
    </svg>
  );
}
