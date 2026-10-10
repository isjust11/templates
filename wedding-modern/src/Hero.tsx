'use client';

import { motion } from 'framer-motion';

export default function Hero({
  brideName,
  groomName,
  dateLabel,
  city,
  coverImage,
  backgroundImage,
}: {
  brideName: string;
  groomName: string;
  dateLabel: string;
  city: string;
  coverImage?: string;
  backgroundImage?: string;
}) {
  const photo = coverImage || backgroundImage;

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden" style={{ background: 'var(--el-bg)' }}>
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-24 md:grid-cols-2">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.42em]"
            style={{ color: 'var(--el-muted)' }}
          >
            Wedding invitation
          </motion.p>
          <div className="mt-6 overflow-hidden">
            <motion.h1
              className="font-display text-6xl leading-[0.9] md:text-8xl"
              style={{ color: 'var(--el-ink)' }}
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {groomName}
            </motion.h1>
          </div>
          <motion.p
            className="my-3 font-script text-4xl"
            style={{ color: 'var(--el-accent)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            and
          </motion.p>
          <div className="overflow-hidden">
            <motion.h1
              className="font-display text-6xl leading-[0.9] md:text-8xl"
              style={{ color: 'var(--el-ink)' }}
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {brideName}
            </motion.h1>
          </div>
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span
              className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.22em]"
              style={{ background: 'var(--el-ink)', color: 'var(--el-on-accent)' }}
            >
              {dateLabel || 'Save the date'}
            </span>
            {city ? (
              <span className="text-sm" style={{ color: 'var(--el-muted)' }}>
                {city}
              </span>
            ) : null}
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden"
          initial={{ clipPath: 'inset(12% 12% 12% 12%)', opacity: 0 }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: 'var(--el-bg-soft)' }}
        >
          {photo ? (
            <motion.img
              src={photo}
              alt=""
              className="h-full w-full object-cover"
              animate={{ scale: [1, 1.08] }}
              transition={{ duration: 16, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-6xl" style={{ color: 'var(--el-accent-soft)' }}>
              {groomName.slice(0, 1)}
              {brideName.slice(0, 1)}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
