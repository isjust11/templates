'use client';

import { useEffect, useRef } from 'react';

type Particle = { x: number; y: number; r: number; vy: number; vx: number; phase: number; speed: number };

/**
 * Soft drifting light motes on a canvas — the template's take on the `petals` ambient effect.
 * Pauses off-screen and while the tab is hidden; callers skip it on low-power devices.
 */
export default function Sparkles({
  count = 28,
  color = '255,255,255',
  maxAlpha = 0.55,
}: {
  count?: number;
  /** "r,g,b" */
  color?: string;
  maxAlpha?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let visible = true;

    const spawn = (initial: boolean): Particle => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + 10,
      r: 0.6 + Math.random() * 2.2,
      vy: 0.12 + Math.random() * 0.35,
      vx: (Math.random() - 0.5) * 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: 0.008 + Math.random() * 0.02,
    });

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const draw = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.vy;
        p.x += p.vx + Math.sin(p.phase) * 0.12;
        p.phase += p.speed;
        if (p.y < -10) Object.assign(p, spawn(false));
        const alpha = maxAlpha * (0.35 + 0.65 * Math.abs(Math.sin(p.phase)));
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        glow.addColorStop(0, `rgba(${color},${alpha})`);
        glow.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    const kick = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
    };

    resize();
    kick();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      kick();
    });
    io.observe(canvas);
    document.addEventListener('visibilitychange', kick);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', kick);
    };
  }, [count, color, maxAlpha]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}
