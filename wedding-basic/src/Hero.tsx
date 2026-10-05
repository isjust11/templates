'use client';

import { motion } from 'framer-motion';
import { useTemplateData } from './TemplateDataProvider';
import InlineSlotEditor from './InlineSlotEditor';
import { getFieldValue, getFieldStyle } from './types';
import { readInviteEffects } from './theme';

export default function Hero() {
  const data = useTemplateData();
  const { brideName, groomName, eventDateDisplay, city, venue, backgroundImage } = data;
  const effects = readInviteEffects(data);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 60% 0%, var(--el-accent-soft) 0%, var(--el-bg-soft) 42%, var(--el-bg) 100%)',
      }}
    >
      {/* Background image layer */}
      {backgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${backgroundImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.08,
          }}
        />
      )}

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-[10%] w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,150,180,0.25) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,180,200,0.2) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 right-[15%] w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,200,215,0.3) 0%, transparent 70%)' }}
        />
      </div>

      {effects.petals ? (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1, 0.5], y: [-20, 20, -20] }}
            transition={{ duration: 6 + i, repeat: Infinity, delay: i * 1.2, ease: 'easeInOut' }}
            className="absolute text-petal-300"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
              fontSize: `${14 + (i % 3) * 8}px`,
            }}
          >
            ✿
          </motion.div>
        ))}
      </div>
      ) : null}

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Date pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-10"
            style={{ ...getFieldStyle(eventDateDisplay), display: getFieldStyle(eventDateDisplay).display || 'inline-flex' }}
          >
            <div className="h-px w-12 bg-petal-300" />
            <span
              className="text-petal-600 text-xs uppercase tracking-[0.35em] font-sans font-medium px-4 py-1.5 rounded-full border border-petal-200"
              style={{ background: 'rgba(255,200,215,0.3)', backdropFilter: 'blur(8px)', color: getFieldStyle(eventDateDisplay).color }}
              data-slot="text.eventDateDisplay"
            >
              <InlineSlotEditor slotKey="eventDateDisplay" label="Ngày hiển thị" value={eventDateDisplay}>
                {getFieldValue(eventDateDisplay)}
              </InlineSlotEditor>
            </span>
            <div className="h-px w-12 bg-petal-300" />
          </motion.div>

          {/* Names */}
          <div className="mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="font-display text-7xl md:text-[9rem] lg:text-[11rem] leading-none text-petal-800 mb-3"
              style={getFieldStyle(groomName)}
              data-slot="text.groomName"
            >
              <InlineSlotEditor slotKey="groomName" label="Tên chú rể" value={groomName}>
                {getFieldValue(groomName)}
              </InlineSlotEditor>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex items-center justify-center gap-6 my-4"
            >
              <div className="h-px flex-1 max-w-[100px]" style={{ background: 'linear-gradient(to right, transparent, #ffb3c3)' }} />
              <span className="font-script text-4xl text-petal-400">{'&'}</span>
              <div className="h-px flex-1 max-w-[100px]" style={{ background: 'linear-gradient(to left, transparent, #ffb3c3)' }} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.9 }}
              className="font-display text-7xl md:text-[9rem] lg:text-[11rem] leading-none text-petal-800"
              style={getFieldStyle(brideName)}
              data-slot="text.brideName"
            >
              <InlineSlotEditor slotKey="brideName" label="Tên cô dâu" value={brideName}>
                {getFieldValue(brideName)}
              </InlineSlotEditor>
            </motion.h1>
          </div>

          {/* Venue info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="space-y-2 mb-12"
          >
            <p
              className="text-lg md:text-xl text-petal-700 font-serif italic"
              style={getFieldStyle(venue)}
              data-slot="text.venue"
            >
              <InlineSlotEditor slotKey="venue" label="Địa điểm" value={venue}>
                {getFieldValue(venue)}
              </InlineSlotEditor>
            </p>
            <p className="text-sm text-petal-500 font-sans uppercase tracking-widest" style={getFieldStyle(city)} data-slot="text.city">
              <InlineSlotEditor slotKey="city" label="Thành phố" value={city}>
                {getFieldValue(city)}
              </InlineSlotEditor>
            </p>
          </motion.div>

          {/* Glass CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <a
              href="#countdown"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-sans text-sm font-medium text-petal-700 uppercase tracking-wider transition-all duration-300 hover:shadow-petal"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,220,232,0.5))',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,180,200,0.5)',
                boxShadow: '0 4px 20px rgba(255,100,140,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
              }}
            >
              <span>Khám phá</span>
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ↓
              </motion.span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
