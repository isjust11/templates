'use client';

import { motion } from 'framer-motion';
import { useTemplateData } from './TemplateDataProvider';
import InlineSlotEditor from './InlineSlotEditor';

export default function Hero() {
  const { brideName, groomName, eventDateDisplay, city, venue } =
    useTemplateData();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden bg-cream-50"
    >
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233e4034' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sage-600 text-sm uppercase tracking-[0.3em] mb-8 font-sans font-medium"
            data-slot="text.eventDateDisplay"
          >
            <InlineSlotEditor slotKey="eventDateDisplay" label="Ngày hiển thị" value={eventDateDisplay}>
              {eventDateDisplay}
            </InlineSlotEditor>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <h1
              className="font-display text-7xl md:text-9xl lg:text-[10rem] text-sage-800 mb-6 leading-none"
              data-slot="text.groomName"
            >
              <InlineSlotEditor slotKey="groomName" label="Tên chú rể" value={groomName}>
                {groomName}
              </InlineSlotEditor>
            </h1>
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="h-px w-20 md:w-32 bg-sage-300" />
              <span className="text-3xl md:text-4xl text-sage-600 font-serif italic">
                &
              </span>
              <div className="h-px w-20 md:w-32 bg-sage-300" />
            </div>
            <h1
              className="font-display text-7xl md:text-9xl lg:text-[10rem] text-sage-800 leading-none"
              data-slot="text.brideName"
            >
              <InlineSlotEditor slotKey="brideName" label="Tên cô dâu" value={brideName}>
                {brideName}
              </InlineSlotEditor>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-3 mb-12"
          >
            <p
              className="text-lg md:text-xl text-sage-700 font-serif"
              data-slot="text.venue"
            >
              <InlineSlotEditor slotKey="venue" label="Địa điểm" value={venue}>
                {venue}
              </InlineSlotEditor>
            </p>
            <p
              className="text-base md:text-lg text-sage-600"
              data-slot="text.city"
            >
              <InlineSlotEditor slotKey="city" label="Thành phố" value={city}>
                {city}
              </InlineSlotEditor>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <a
              href="#countdown"
              className="inline-block bg-sage-800 hover:bg-sage-900 text-cream-50 px-10 py-4 rounded-full font-sans text-sm font-medium uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              ↓
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <svg
                className="w-6 h-6 text-sage-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
