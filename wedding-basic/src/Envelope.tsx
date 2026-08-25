'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvelopeProps {
  children: React.ReactNode;
  brideName: string;
  groomName: string;
}

type ConfettiFunction = (options?: unknown) => void;

export default function Envelope({ children, brideName, groomName }: EnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [confettiModule, setConfettiModule] = useState<ConfettiFunction | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startMusic = useCallback(() => {
    if (audioRef.current) return;
    const audio = new Audio('/music/song.mp3');
    audio.loop = true;
    audio.play().catch(() => {});
    audioRef.current = audio;
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  }, []);

  useEffect(() => {
    // Dynamically import confetti only on client side
    import('canvas-confetti').then((module) => {
      setConfettiModule(() => module.default);
    });
  }, []);

  const handleOpen = async () => {
    if (isOpening) return;

    // Start music and opening animation
    startMusic();
    setIsOpening(true);

    // After flap opens, show content
    setTimeout(() => {
      setIsOpened(true);
      triggerConfetti();
    }, 1200);
  };

  const triggerConfetti = () => {
    if (!confettiModule) return;

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-cream-50 via-white to-cream-100 overflow-hidden"
          >
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-10 w-72 h-72 bg-sage-200/20 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-cream-200/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-2xl w-full px-4">
              {/* Envelope */}
              <motion.div
                onClick={handleOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-full cursor-pointer focus:outline-none group"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                {/* Envelope body */}
                <div className="relative bg-gradient-to-br from-cream-100 to-cream-200 rounded-lg shadow-2xl overflow-hidden border-2 border-sage-300 aspect-[3/2] flex items-center justify-center">
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                  </div>

                  {/* Envelope flap */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-br from-sage-500 to-sage-600 origin-top border-b-2 border-sage-700"
                    style={{
                      clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
                      transformStyle: 'preserve-3d',
                    }}
                    animate={{
                      rotateX: isOpening ? -180 : [0, -5, 0],
                    }}
                    transition={isOpening ? {
                      duration: 0.8,
                      ease: [0.4, 0, 0.2, 1],
                    } : {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }}
                  />

                  {/* Letter sliding out */}
                  <motion.div
                    className="absolute inset-x-4 top-4 bottom-4 bg-white mt-6 rounded shadow-lg flex items-center justify-center"
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
                      <p className="text-sage-400 text-xs uppercase tracking-[0.2em] mb-2 font-sans">Шақыру</p>
                      <p className="font-script text-2xl text-sage-700">{groomName} & {brideName}</p>
                    </div>
                  </motion.div>

                  {/* Wax seal - centered on envelope */}
                  <motion.div
                    className="absolute left-1/2.5 top-20 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-sage-600 shadow-xl flex items-center justify-center border-4 border-sage-700 z-20"
                    animate={{
                      scale: isOpening ? [1, 1.2, 0] : 1,
                      rotate: isOpening ? [0, 15, -10] : 0,
                      opacity: isOpening ? [1, 1, 0] : 1,
                    }}
                    whileHover={!isOpening ? { rotate: 360 } : {}}
                    transition={isOpening ? { duration: 0.5, ease: 'easeOut' } : { duration: 0.6 }}
                  >
                    <span className="font-script text-2xl text-white">
                      {groomName.charAt(0)}&{brideName.charAt(0)}
                    </span>
                  </motion.div>
                </div>

                {/* Hover instruction */}
                <motion.div
                  className="text-center mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isOpening ? 0 : 1 }}
                  transition={{ delay: 1.5, duration: 0.3 }}
                >
                  <p className="text-sage-600 text-sm font-sans mb-2">
                    Шақыруды ашу үшін конвертті басыңыз
                  </p>
                  <button
                    onClick={handleSkip}
                    className="text-sage-400 text-xs uppercase tracking-wider hover:text-sage-600 transition-colors font-sans"
                  >
                    Өткізу
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
        {isOpened && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, delay: 1 }}
            onClick={toggleMute}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-sage-800 text-cream-50 shadow-lg hover:bg-sage-900 transition-colors flex items-center justify-center"
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
