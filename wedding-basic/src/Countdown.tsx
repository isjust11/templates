'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const [prevValues, setPrevValues] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const calc = (): TimeLeft => {
      const diff = +new Date(targetDate) - +new Date();
      if (diff > 0) return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };
    setTimeLeft(calc());
    const timer = setInterval(() => {
      setPrevValues(prev => prev);
      setTimeLeft(calc());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, mounted]);

  if (!mounted) return <div className="h-48" />;

  const units = [
    { label: 'Ngày', value: timeLeft.days },
    { label: 'Giờ', value: timeLeft.hours },
    { label: 'Phút', value: timeLeft.minutes },
    { label: 'Giây', value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-4 md:gap-6">
      {units.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.12, duration: 0.7 }}
          className="flex flex-col items-center"
        >
          {/* Glass card */}
          <div
            className="relative flex flex-col items-center justify-center rounded-2xl p-5 md:p-8 min-w-[80px] md:min-w-[120px] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,230,238,0.5) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,180,200,0.4)',
              boxShadow: '0 8px 32px rgba(255,100,140,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
            }}
          >
            {/* Shine */}
            <div
              className="absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl pointer-events-none"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)' }}
            />
            <AnimatePresence mode="popLayout">
              <motion.div
                key={unit.value}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-4xl md:text-6xl font-display font-semibold text-petal-800 tabular-nums"
              >
                {unit.value.toString().padStart(2, '0')}
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-3 text-xs md:text-sm text-petal-500 font-sans uppercase tracking-[0.18em] font-medium">
            {unit.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
