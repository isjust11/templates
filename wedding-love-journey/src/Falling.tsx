'use client';

import { useEffect, useRef } from 'react';
import { Butterfly } from './Botanicals';

type Kind = 'leaf' | 'petal' | 'heart';

type Particle = {
  kind: Kind;
  sprite: HTMLCanvasElement;
  x: number;
  y: number;
  vy: number;
  size: number;
  rot: number;
  spin: number;
  flip: number;
  flipSpeed: number;
  sway: number;
  phase: number;
  alpha: number;
};

const LEAF_COLORS: Array<[string, string]> = [
  ['#a9c08f', '#5f7f52'],
  ['#c3d3a6', '#7f9a68'],
  ['#8fae7b', '#4f6d47'],
];
const PETAL_COLORS: Array<[string, string]> = [
  ['#fde4e8', '#f1a7b5'],
  ['#fff1f2', '#f4bcc6'],
  ['#fbd5dc', '#e78b9e'],
];
const HEART_COLORS: Array<[string, string]> = [
  ['#f7c3cc', '#d9667d'],
  ['#fde0e5', '#e98ea0'],
];

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

function sprite(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx, size);
  return canvas;
}

function leafSprite([light, dark]: [string, string]) {
  return sprite(64, (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, light);
    g.addColorStop(1, dark);
    ctx.translate(s / 2, s / 2);
    ctx.rotate(-Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(-26, 0);
    ctx.bezierCurveTo(-12, -14, 12, -14, 26, 0);
    ctx.bezierCurveTo(12, 14, -12, 14, -26, 0);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-24, 0);
    ctx.lineTo(24, 0);
    ctx.strokeStyle = 'rgba(240,246,228,.65)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  });
}

function petalSprite([light, dark]: [string, string]) {
  return sprite(64, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s * 0.85, 2, s / 2, s / 2, s / 2);
    g.addColorStop(0, dark);
    g.addColorStop(1, light);
    ctx.translate(s / 2, s / 2);
    ctx.beginPath();
    ctx.moveTo(0, 24);
    ctx.bezierCurveTo(-22, 10, -20, -18, -6, -22);
    ctx.quadraticCurveTo(0, -16, 6, -22);
    ctx.bezierCurveTo(20, -18, 22, 10, 0, 24);
    ctx.fillStyle = g;
    ctx.fill();
  });
}

function heartSprite([light, dark]: [string, string]) {
  return sprite(64, (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, light);
    g.addColorStop(1, dark);
    ctx.translate(s / 2, s / 2);
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.bezierCurveTo(-30, 2, -20, -26, 0, -12);
    ctx.bezierCurveTo(20, -26, 30, 2, 0, 20);
    ctx.fillStyle = g;
    ctx.fill();
  });
}

/** Leaves and petals drifting down, optional hearts rising, plus two butterflies. Pointer-transparent. */
export default function Falling({ leaves, hearts }: { leaves: boolean; hearts: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || (!leaves && !hearts)) return;

    const sprites = {
      leaf: LEAF_COLORS.map(leafSprite),
      petal: PETAL_COLORS.map(petalSprite),
      heart: HEART_COLORS.map(heartSprite),
    };

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (kind: Kind, anywhere: boolean): Particle => {
      const rising = kind === 'heart';
      const size = kind === 'leaf' ? rand(14, 24) : kind === 'petal' ? rand(10, 17) : rand(9, 14);
      return {
        kind,
        sprite: pick(sprites[kind]),
        x: rand(0, width),
        y: anywhere ? rand(0, height) : rising ? height + 20 : -30,
        vy: rising ? -rand(0.25, 0.5) : rand(0.35, 0.8),
        size,
        rot: rand(0, Math.PI * 2),
        spin: rand(-0.012, 0.012),
        flip: rand(0, Math.PI * 2),
        flipSpeed: kind === 'heart' ? 0 : rand(0.012, 0.03),
        sway: rand(0.25, 0.7),
        phase: rand(0, Math.PI * 2),
        alpha: kind === 'heart' ? rand(0.35, 0.6) : rand(0.65, 0.95),
      };
    };

    const density = Math.min(1.4, Math.max(0.7, width / 480));
    const particles: Particle[] = [];
    if (leaves) {
      for (let i = 0; i < Math.round(8 * density); i += 1) particles.push(spawn('leaf', true));
      for (let i = 0; i < Math.round(9 * density); i += 1) particles.push(spawn('petal', true));
    }
    if (hearts) {
      for (let i = 0; i < 4; i += 1) particles.push(spawn('heart', true));
    }

    let frame = 0;
    let t = 0;
    const tick = () => {
      t += 1;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i += 1) {
        let p = particles[i];
        p.y += p.vy;
        p.x += Math.sin(t * 0.012 + p.phase) * p.sway + (p.kind === 'heart' ? 0 : 0.15);
        p.rot += p.spin;
        p.flip += p.flipSpeed;
        const gone = p.vy > 0 ? p.y > height + 40 : p.y < -40;
        if (gone || p.x < -60 || p.x > width + 60) {
          p = particles[i] = spawn(p.kind, false);
        }
        const fade = p.kind === 'heart' ? Math.min(1, (height - p.y) / 120, p.y / 160) : 1;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha * fade);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.kind === 'heart' ? Math.sin(t * 0.02 + p.phase) * 0.18 : p.rot);
        ctx.scale(1, p.kind === 'heart' ? 1 : 0.35 + Math.abs(Math.cos(p.flip)) * 0.65);
        ctx.drawImage(p.sprite, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
      frame = window.requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      window.cancelAnimationFrame(frame);
      if (!document.hidden) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [leaves, hearts]);

  return (
    <>
      <canvas ref={ref} className="lj-falling" aria-hidden="true" />
      {hearts ? (
        <>
          <Butterfly className="lj-flyer lj-flyer--a" />
          <Butterfly className="lj-flyer lj-flyer--b" />
        </>
      ) : null}
    </>
  );
}
