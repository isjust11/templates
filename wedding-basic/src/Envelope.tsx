'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTemplateData } from './TemplateDataProvider';
import { readInviteEffects } from './theme';

interface EnvelopeProps {
  children: React.ReactNode;
  brideName: string;
  groomName: string;
  coverImage?: string;
  onOpened?: () => void;
}

type ConfettiFunction = (options?: unknown) => void;

export default function Envelope({ children, brideName, groomName, coverImage, onOpened }: EnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [confettiModule, setConfettiModule] = useState<ConfettiFunction | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const effects = readInviteEffects(useTemplateData());

  const startMusic = useCallback(() => {
    if (!effects.musicEnabled || audioRef.current) return;
    const audio = new Audio(effects.musicUrl || '/music/song.mp3');
    audio.loop = true;
    audio.play().catch(() => {});
    audioRef.current = audio;
  }, [effects.musicEnabled, effects.musicUrl]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  }, []);

  useEffect(() => {
    if (!effects.confetti) return;
    import('canvas-confetti').then((module) => {
      setConfettiModule(() => module.default);
    });
  }, [effects.confetti]);

  const handleOpen = async () => {
    if (isOpening) return;

    // Start music and opening animation
    startMusic();
    setIsOpening(true);

    // After flap opens, show content
    setTimeout(() => {
      setIsOpened(true);
      onOpened?.();
      triggerConfetti();
    }, 1200);
  };

  const triggerConfetti = () => {
    if (!effects.confetti || !confettiModule) return;

    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from left
      confettiModule({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#717561', '#8a9273', '#9eaa8a', '#f7f4e6', '#ede8d5'],
      });

      // Confetti from right
      confettiModule({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#717561', '#8a9273', '#9eaa8a', '#f7f4e6', '#ede8d5'],
      });
    }, 250);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    startMusic();
    setIsOpened(true);
    onOpened?.();
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 overflow-hidden"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'radial-gradient(ellipse at 50% 30%, var(--el-accent-soft) 0%, var(--el-bg-soft) 42%, var(--el-bg) 100%)',
            }}
          >
            {/* Floating blobs */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-10 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,180,210,0.3) 0%, transparent 70%)' }} />
              <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,150,190,0.2) 0%, transparent 70%)' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,200,220,0.15) 0%, transparent 60%)' }} />
            </div>

            <div className="relative z-10 flex w-full flex-col items-center px-8">
              {/* Envelope */}
              <motion.div
                onClick={handleOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-full max-w-[280px] cursor-pointer focus:outline-none group"
                style={{ marginLeft: 'auto', marginRight: 'auto' }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                {/* Envelope body */}
                <div className="relative bg-white/40 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-white/60 aspect-[3/2] flex items-center justify-center">
                  <div className={`absolute inset-0 ${coverImage ? 'opacity-80' : 'opacity-100'}`}>
                    <div className="absolute inset-0" style={{
                      backgroundImage: coverImage
                        ? `url("${coverImage}")`
                        : 'linear-gradient(135deg, #fff0f4 0%, #ffc9d9 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }} />
                  </div>

                  {/* Envelope flap */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-1/2 origin-top border-b-2"
                    style={{
                      background: 'linear-gradient(135deg, #ff9db7, #ef4065)',
                      borderColor: '#c9244d',
                      clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
                      transformStyle: 'preserve-3d',
                    }}
                    animate={{
                      rotateX: isOpening ? -180 : effects.envelope ? [0, -5, 0] : 0,
                    }}
                    transition={isOpening ? {
                      duration: 0.8,
                      ease: [0.4, 0, 0.2, 1],
                    } : effects.envelope ? {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    } : { duration: 0.2 }}
                  />

                  {/* Letter content */}
                  <motion.div
                    className="absolute inset-x-4 top-4 bottom-4 mt-6 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 8px 32px rgba(255,100,140,0.15)',
                    }}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{
                      y: isOpening ? -20 : 40,
                      opacity: isOpening ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: isOpening ? 0.4 : 0,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <div className="text-center p-4">
                      <p className="text-petal-400 text-xs uppercase tracking-[0.2em] mb-2 font-sans">Thiệp mời</p>
                      <p className="font-script text-2xl text-petal-700">{groomName} & {brideName}</p>
                    </div>
                  </motion.div>

                  {/* Wax seal — x/y live on the motion style so scale/rotate do not drop the centering translate */}
                  <motion.div
                    className="absolute z-20 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-4"
                    style={{
                      left: '50%',
                      top: '30%',
                      x: '-50%',
                      y: '-50%',
                      background: 'linear-gradient(135deg, #ff9db7, #ef4065)',
                      borderColor: '#c9244d',
                      boxShadow: '0 6px 24px rgba(255,100,140,0.4)',
                    }}
                    animate={{
                      scale: isOpening ? [1, 1.2, 0] : 1,
                      rotate: isOpening ? [0, 15, -10] : 0,
                      opacity: isOpening ? [1, 1, 0] : 1,
                    }}
                    whileHover={!isOpening ? { rotate: 360 } : {}}
                    transition={isOpening ? { duration: 0.5, ease: 'easeOut' } : { duration: 0.6 }}
                  >
                    <span className="font-script text-2xl leading-none text-white">
                      {groomName.charAt(0)}&{brideName.charAt(0)}
                    </span>
                  </motion.div>
                </div>

                {/* Hover instruction */}
                <motion.div
                  className="mt-6 w-full text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isOpening ? 0 : 1 }}
                  transition={{ delay: 1.2, duration: 0.3 }}
                >
                  <p className="mb-3 font-sans text-sm text-petal-600">
                    Nhấn vào phong bì để mở thiệp mời
                  </p>
                  <button
                    onClick={handleSkip}
                    className="font-sans text-xs uppercase tracking-[0.2em] text-petal-400 transition-colors hover:text-petal-600"
                  >
                    Bỏ qua
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="min-h-screen"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mute/unmute toggle */}
      <AnimatePresence>
        {isOpened && effects.musicEnabled && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ff9db7, #ef4065)', boxShadow: '0 6px 24px rgba(255,100,140,0.3)' }}
            aria-label={isMuted ? 'Unmute music' : 'Mute music'}
          >
            {isMuted ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
