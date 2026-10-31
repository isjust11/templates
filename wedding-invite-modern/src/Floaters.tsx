'use client';

import { useEffect, useRef } from 'react';

type Sprite = { front: HTMLCanvasElement; back: HTMLCanvasElement; soft: HTMLCanvasElement };

type Particle = {
  kind: 'heart' | 'petal';
  sprite: Sprite;
  x: number;
  y: number;
  /** 0 = far behind, 1 = right in front of the lens. Drives size, speed, opacity and focus. */
  z: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  /** Rotation around the petal's own axis; its cosine is the visible width, its sign the side shown. */
  spin: number;
  vs: number;
  phase: number;
  alpha: number;
  /** Burst particles disappear at the edge instead of respawning. */
  once: boolean;
};

type Palette = [deep: string, mid: string, light: string];

const PETAL_PALETTES: { shape: 'notch' | 'round'; colors: Palette }[] = [
  { shape: 'notch', colors: ['#d9617f', '#f4a9bb', '#fff1f4'] },
  { shape: 'notch', colors: ['#e57f98', '#f8c3cf', '#fff8fa'] },
  { shape: 'round', colors: ['#a8243f', '#dc6680', '#f6b8c5'] },
  { shape: 'round', colors: ['#cfa27e', '#eedac4', '#fffaf2'] },
];
const HEART_PALETTES: Palette[] = [
  ['#9e1631', '#e0405f', '#ffb3c2'],
  ['#b8264a', '#f06a87', '#ffd0da'],
  ['#c23a56', '#f58fa5', '#ffe1e7'],
];

const SPRITE = 96;
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

function canvas(size: number) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  return c;
}

function heartPath(ctx: CanvasRenderingContext2D, s: number) {
  const top = -s * 0.45;
  ctx.beginPath();
  ctx.moveTo(0, top + s * 0.3);
  ctx.bezierCurveTo(0, top, -s * 0.5, top, -s * 0.5, top + s * 0.3);
  ctx.bezierCurveTo(-s * 0.5, top + s * 0.6, 0, top + s * 0.78, 0, top + s);
  ctx.bezierCurveTo(0, top + s * 0.78, s * 0.5, top + s * 0.6, s * 0.5, top + s * 0.3);
  ctx.bezierCurveTo(s * 0.5, top, 0, top, 0, top + s * 0.3);
  ctx.closePath();
}

function petalPath(ctx: CanvasRenderingContext2D, L: number, shape: 'notch' | 'round') {
  ctx.beginPath();
  ctx.moveTo(0, L);
  ctx.bezierCurveTo(-L * 0.78, L * 0.42, -L * 0.74, -L * 0.74, -L * 0.2, -L * 0.92);
  if (shape === 'notch') {
    ctx.quadraticCurveTo(-L * 0.07, -L * 0.96, 0, -L * 0.76);
    ctx.quadraticCurveTo(L * 0.07, -L * 0.96, L * 0.2, -L * 0.92);
  } else {
    ctx.quadraticCurveTo(0, -L * 1.04, L * 0.2, -L * 0.92);
  }
  ctx.bezierCurveTo(L * 0.74, -L * 0.74, L * 0.78, L * 0.42, 0, L);
  ctx.closePath();
}

function paintPetal(c: HTMLCanvasElement, shape: 'notch' | 'round', [deep, mid, light]: Palette, back: boolean) {
  const ctx = c.getContext('2d')!;
  const L = SPRITE * 0.4;
  ctx.translate(SPRITE / 2, SPRITE / 2);
  petalPath(ctx, L, shape);
  const g = ctx.createRadialGradient(0, L, L * 0.05, 0, L * 0.2, L * 2);
  g.addColorStop(0, deep);
  g.addColorStop(0.42, mid);
  g.addColorStop(1, light);
  ctx.fillStyle = g;
  ctx.fill();
  if (back) {
    // The underside is matte and paler, so a flipping petal visibly changes face.
    ctx.fillStyle = 'rgba(255, 246, 248, 0.34)';
    ctx.fill();
  } else {
    ctx.save();
    ctx.clip();
    const sheen = ctx.createLinearGradient(-L, -L, L, L);
    sheen.addColorStop(0, 'rgba(255,255,255,0)');
    sheen.addColorStop(0.45, 'rgba(255,255,255,0.28)');
    sheen.addColorStop(0.6, 'rgba(255,255,255,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(-L, -L, L * 2, L * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 0.8;
    for (const spread of [-0.34, 0, 0.34]) {
      ctx.beginPath();
      ctx.moveTo(0, L * 0.9);
      ctx.quadraticCurveTo(spread * L * 0.5, 0, spread * L, -L * 0.7);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.strokeStyle = deep;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 0.8;
  ctx.stroke();
}

function paintHeart(c: HTMLCanvasElement, [deep, mid, light]: Palette) {
  const ctx = c.getContext('2d')!;
  const s = SPRITE * 0.62;
  ctx.translate(SPRITE / 2, SPRITE / 2);
  heartPath(ctx, s);
  const g = ctx.createRadialGradient(-s * 0.16, -s * 0.2, s * 0.02, 0, 0, s * 0.62);
  g.addColorStop(0, light);
  g.addColorStop(0.42, mid);
  g.addColorStop(1, deep);
  ctx.shadowColor = mid;
  ctx.shadowBlur = SPRITE * 0.1;
  ctx.fillStyle = g;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = deep;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath();
  ctx.ellipse(-s * 0.2, -s * 0.12, s * 0.1, s * 0.055, -0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.arc(-s * 0.07, -s * 0.2, s * 0.025, 0, Math.PI * 2);
  ctx.fill();
}

/** Out-of-focus copy via downscale and upscale; works where `ctx.filter` does not (Safari). */
function soften(src: HTMLCanvasElement) {
  const small = canvas(SPRITE / 6);
  const sctx = small.getContext('2d')!;
  sctx.imageSmoothingQuality = 'high';
  sctx.drawImage(src, 0, 0, small.width, small.height);
  const out = canvas(SPRITE);
  const octx = out.getContext('2d')!;
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(small, 0, 0, SPRITE, SPRITE);
  return out;
}

function buildSprites() {
  const petals: Sprite[] = PETAL_PALETTES.map(({ shape, colors }) => {
    const front = canvas(SPRITE);
    const back = canvas(SPRITE);
    paintPetal(front, shape, colors, false);
    paintPetal(back, shape, colors, true);
    return { front, back, soft: soften(front) };
  });
  const hearts: Sprite[] = HEART_PALETTES.map((colors) => {
    const front = canvas(SPRITE);
    paintHeart(front, colors);
    return { front, back: front, soft: soften(front) };
  });
  return { petals, hearts };
}

/**
 * Fixed canvas over the page: glossy hearts drift up, blossom and rose petals tumble down on a
 * gusty breeze. Particles sit at random depths, far ones small and blurred, a few close ones
 * large and out of focus. Each change of `burst` releases a wave of hearts. Pauses while hidden.
 */
export default function Floaters({
  hearts,
  petals,
  burst = 0,
  heartCount = 10,
  petalCount = 20,
}: {
  hearts: boolean;
  petals: boolean;
  burst?: number;
  heartCount?: number;
  petalCount?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const size = useRef({ width: 0, height: 0 });
  const sprites = useRef<ReturnType<typeof buildSprites> | null>(null);
  const kick = useRef<() => void>(() => {});

  useEffect(() => {
    const el = ref.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    sprites.current ??= buildSprites();
    const art = sprites.current;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame = 0;
    let last = 0;

    const depth = () => (Math.random() < 0.1 ? rand(0.92, 1) : rand(0, 0.85));

    const spawnHeart = (scatter: boolean): Particle => {
      const { width, height } = size.current;
      const z = depth();
      return {
        kind: 'heart',
        sprite: pick(art.hearts),
        x: rand(0, width),
        y: scatter ? rand(height * 0.3, height) : height + rand(20, 80),
        z,
        vx: 0,
        vy: -rand(0.4, 0.8) * (0.5 + z * 0.8),
        size: rand(16, 26) * (0.5 + z * 1.2),
        rot: rand(-0.3, 0.3),
        vr: 0,
        spin: 0,
        vs: 0,
        phase: rand(0, Math.PI * 2),
        alpha: z > 0.9 ? 0.45 : 0.4 + z * 0.5,
        once: false,
      };
    };

    const spawnPetal = (scatter: boolean): Particle => {
      const { width, height } = size.current;
      const z = depth();
      return {
        kind: 'petal',
        sprite: pick(art.petals),
        x: rand(-width * 0.2, width),
        y: scatter ? rand(0, height) : -rand(20, 80),
        z,
        vx: rand(0.15, 0.45),
        vy: rand(0.45, 0.85) * (0.5 + z * 0.9),
        size: rand(16, 26) * (0.5 + z * 1.3),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.012, 0.012),
        spin: rand(0, Math.PI * 2),
        vs: rand(0.02, 0.055),
        phase: rand(0, Math.PI * 2),
        alpha: z > 0.9 ? 0.55 : 0.5 + z * 0.45,
        once: false,
      };
    };

    const seed = () => {
      particles.current = particles.current.filter((p) => p.once);
      if (hearts) for (let i = 0; i < heartCount; i++) particles.current.push(spawnHeart(true));
      if (petals) for (let i = 0; i < petalCount; i++) particles.current.push(spawnPetal(true));
    };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      size.current = { width, height };
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingQuality = 'high';
    };

    const draw = (now: number) => {
      frame = 0;
      if (document.hidden) {
        last = 0;
        return;
      }
      const dt = last ? Math.min(3, (now - last) / 16.67) : 1;
      last = now;
      const { width, height } = size.current;
      const wind = Math.sin(now / 2600) * 0.45 + Math.sin(now / 1100) * 0.22 + Math.sin(now / 470) * 0.08;
      ctx.clearRect(0, 0, width, height);

      const next: Particle[] = [];
      for (const p of particles.current) {
        p.phase += 0.02 * dt;
        const focus = p.z > 0.9 || p.z < 0.2 ? p.sprite.soft : null;
        if (p.kind === 'heart') {
          p.x += (Math.sin(p.phase) * 0.45 + p.vx + wind * 0.25 * p.z) * dt;
          p.y += p.vy * dt;
          if (p.once) p.vy = Math.min(-0.7, p.vy * 0.992);
          p.vx *= 0.98;
          if (p.y < -60) {
            if (!p.once) next.push(spawnHeart(false));
            continue;
          }
          const fade = Math.min(1, Math.max(0, p.y / (height * 0.35)));
          const beat = 1 + Math.max(0, Math.sin(p.phase * 3)) * 0.05;
          const d = p.size * 1.6 * beat;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot + Math.sin(p.phase) * 0.15);
          ctx.globalAlpha = p.alpha * fade;
          ctx.drawImage(focus ?? p.sprite.front, -d / 2, -d / 2, d, d);
          ctx.restore();
        } else {
          p.spin += p.vs * dt;
          const turn = Math.cos(p.spin);
          // A petal edge-on catches the air and slides sideways; face-on it drops faster.
          p.x += (p.vx + wind * (0.4 + p.z) + Math.sin(p.spin) * 0.5) * dt;
          p.y += p.vy * (0.75 + Math.abs(turn) * 0.45) * dt;
          p.rot += (p.vr + Math.sin(p.phase) * 0.004) * dt;
          if (p.y > height + 60 || p.x > width + 60 || p.x < -width * 0.3) {
            if (!p.once) next.push(spawnPetal(false));
            continue;
          }
          const d = p.size * 2;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(Math.max(0.12, Math.abs(turn)), 0.82 + Math.sin(p.spin * 0.7) * 0.18);
          ctx.globalAlpha = p.alpha;
          ctx.drawImage(focus ?? (turn >= 0 ? p.sprite.front : p.sprite.back), -d / 2, -d / 2, d, d);
          ctx.restore();
        }
        next.push(p);
      }
      next.sort((a, b) => a.z - b.z);
      particles.current = next;
      if (next.length) frame = requestAnimationFrame(draw);
    };

    kick.current = () => {
      if (!frame && !document.hidden && particles.current.length) frame = requestAnimationFrame(draw);
    };

    resize();
    seed();
    particles.current.sort((a, b) => a.z - b.z);
    kick.current();
    window.addEventListener('resize', resize);
    const onVisibility = () => kick.current();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      kick.current = () => {};
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [hearts, petals, heartCount, petalCount]);

  useEffect(() => {
    if (!burst) return;
    sprites.current ??= buildSprites();
    const art = sprites.current;
    const { width, height } = size.current;
    for (let i = 0; i < 38; i++) {
      const z = rand(0.3, 1);
      particles.current.push({
        kind: 'heart',
        sprite: pick(art.hearts),
        x: width / 2 + rand(-width * 0.38, width * 0.38),
        y: height + rand(0, 140),
        z,
        vx: rand(-1.2, 1.2),
        vy: -rand(2.2, 4.4) * (0.6 + z * 0.5),
        size: rand(16, 28) * (0.6 + z * 0.9),
        rot: rand(-0.4, 0.4),
        vr: 0,
        spin: 0,
        vs: 0,
        phase: rand(0, Math.PI * 2),
        alpha: rand(0.75, 1),
        once: true,
      });
    }
    particles.current.sort((a, b) => a.z - b.z);
    kick.current();
  }, [burst]);

  return <canvas ref={ref} className="elm-floaters" aria-hidden="true" />;
}
