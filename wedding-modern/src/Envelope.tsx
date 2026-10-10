'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { initials } from './fields';
import { readInviteEffects } from './theme';

type ConfettiFn = (options?: unknown) => void;

export default function Envelope({
  brideName,
  groomName,
  coverImage,
  data,
  onOpened,
  children,
}: {
  brideName: string;
  groomName: string;
  coverImage?: string;
  data?: Record<string, unknown> | null;
  onOpened?: () => void;
  children: ReactNode;
}) {
  const effects = readInviteEffects(data);
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const confettiRef = useRef<ConfettiFn | null>(null);

  useEffect(() => {
    if (!effects.confetti) return;
    import('canvas-confetti').then((mod) => {
      confettiRef.current = mod.default;
    });
  }, [effects.confetti]);

  const startMusic = useCallback(() => {
    if (!effects.musicEnabled || audioRef.current) return;
    const audio = new Audio(effects.musicUrl || '/music/song.mp3');
    audio.loop = true;
    audio.play().catch(() => {});
    audioRef.current = audio;
  }, [effects.musicEnabled, effects.musicUrl]);

  const finishOpen = () => {
    setOpened(true);
    onOpened?.();
    if (!effects.confetti || !confettiRef.current) return;
    const burst = confettiRef.current;
    burst({ particleCount: 90, spread: 70, origin: { y: 0.7 }, colors: ['#161616', '#cfc6b8', '#f7f5f2', '#8a8178'] });
  };

  const open = () => {
    if (opening || opened) return;
    startMusic();
    setOpening(true);
    window.setTimeout(finishOpen, 900);
  };

  const skip = () => {
    startMusic();
    setOpening(true);
    finishOpen();
  };

  return (
    <>
      <AnimatePresence>
        {!opened ? (
          <motion.div
            key="gate"
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            style={{ background: 'var(--el-ink)', color: 'var(--el-on-accent)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              type="button"
              onClick={open}
              className="relative w-full max-w-[320px] overflow-hidden text-left"
              style={{ background: 'var(--el-bg)', color: 'var(--el-ink)', aspectRatio: '3 / 4' }}
              initial={{ y: 40, opacity: 0 }}
              animate={
                effects.envelope && !opening
                  ? { y: [0, -10, 0], opacity: 1 }
                  : { y: opening ? -30 : 0, opacity: opening ? 0 : 1, scale: opening ? 0.96 : 1 }
              }
              transition={
                effects.envelope && !opening
                  ? { y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.6 } }
                  : { duration: 0.7 }
              }
            >
              {coverImage ? (
                <img src={coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : null}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.55))' }} />
              <div className="relative flex h-full flex-col justify-between p-6 text-white">
                <p className="text-[11px] uppercase tracking-[0.42em]">Thiệp mời</p>
                <div>
                  <p className="font-display text-5xl leading-none">{initials(groomName)}{initials(brideName)}</p>
                  <p className="mt-4 font-sans text-sm tracking-wide">
                    {groomName} & {brideName}
                  </p>
                  <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-white/80">Nhấn để mở</p>
                </div>
              </div>
            </motion.button>
            <button
              type="button"
              onClick={skip}
              className="absolute bottom-8 text-[11px] uppercase tracking-[0.32em] text-white/70"
            >
              Bỏ qua
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {opened ? (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {children}
        </motion.div>
      ) : null}

      {opened && effects.musicEnabled ? (
        <button
          type="button"
          aria-label={muted ? 'Bật nhạc' : 'Tắt nhạc'}
          onClick={() => {
            if (!audioRef.current) return;
            audioRef.current.muted = !audioRef.current.muted;
            setMuted(audioRef.current.muted);
          }}
          className="fixed bottom-6 right-6 z-[70] h-12 w-12 rounded-full text-xs"
          style={{ background: 'var(--el-accent)', color: 'var(--el-on-accent)' }}
        >
          {muted ? 'Off' : 'On'}
        </button>
      ) : null}
    </>
  );
}
