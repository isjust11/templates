'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useTemplateData } from './TemplateDataProvider';

export default function WeddingDay() {
  const { schedule, scheduleIntro, locale } = useTemplateData();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isVi = locale.startsWith('vi');

  return (
    <section id="wedding-day" className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-sage-400 text-sm">♥</span>
            <span className="text-sage-600 text-base">♥</span>
            <span className="text-sage-400 text-sm">♥</span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl text-sage-800 mb-6">
            {isVi ? 'Ngày cưới' : 'Той күні'}
          </h2>
          <p
            className="text-sage-600 font-serif text-lg max-w-2xl mx-auto leading-relaxed"
            data-slot="text.scheduleIntro"
          >
            {scheduleIntro}
          </p>
        </motion.div>

        <div ref={ref} className="relative mt-20" data-slot="list.schedule">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-sage-200 transform -translate-x-1/2 hidden md:block" />

          <div className="space-y-24">
            {schedule.map((event, index) => (
              <motion.div
                key={`${event.time}-${event.title}`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-sage-600 rounded-full ring-4 ring-white shadow-md hidden md:block z-10"
                  style={{ top: '120px' }}
                />

                <div
                  className={`grid md:grid-cols-2 gap-8 items-center ${
                    event.side === 'left' ? 'md:grid-flow-dense' : ''
                  }`}
                >
                  <div
                    className={`${
                      event.side === 'left'
                        ? 'md:col-start-2 md:text-left'
                        : 'md:text-right '
                    }`}
                  >
                    <div className="text-sage-600 font-sans text-sm font-bold uppercase tracking-widest mb-4">
                      {event.time}
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl text-sage-800 mb-4">
                      {event.title}
                    </h3>
                    <p className="text-sage-700 font-serif leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div
                    className={`${event.side === 'left' ? 'md:col-start-1' : ''}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
