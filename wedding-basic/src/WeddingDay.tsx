'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useTemplateData } from './TemplateDataProvider';
import { getFieldValue, getFieldStyle } from './types';

export default function WeddingDay() {
  const { schedule, scheduleIntro } = useTemplateData();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="wedding-day"
      className="py-28 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fff5f7 50%, #fff0f4 100%)' }}
    >
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #ffb3c3 30%, #ffb3c3 70%, transparent)' }} />

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-petal-400 mb-4 font-medium">Chương trình</p>
          <h2 className="font-display text-5xl md:text-7xl text-petal-800 mb-5">
            Ngày Cưới
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #ffb3c3)' }} />
            <span className="text-petal-300 text-lg">✿</span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, #ffb3c3)' }} />
          </div>
          <p className="text-petal-600 font-serif text-lg max-w-2xl mx-auto leading-relaxed italic" style={getFieldStyle(scheduleIntro)}>
            {getFieldValue(scheduleIntro)}
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={ref} className="relative" data-slot="list.schedule">
          {/* Center line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
            style={{ background: 'linear-gradient(to bottom, transparent, #ffb3c3 15%, #ffb3c3 85%, transparent)' }}
          />

          <div className="space-y-20">
            {(() => {
              let arr = getFieldValue(schedule);
              if (typeof arr === 'string') {
                try { arr = JSON.parse(arr); } catch (e) { arr = []; }
              }
              if (!Array.isArray(arr)) arr = [];
              return arr.map((event: any, index: number) => (
                <motion.div
                  key={`${event.time}-${event.title}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: index * 0.18 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full hidden md:block z-10 ring-4 ring-white"
                    style={{ top: '50%', background: 'linear-gradient(135deg, #ff9db7, #ef4065)', boxShadow: '0 0 12px rgba(255,100,140,0.4)' }}
                  />

                  <div
                    className={`grid md:grid-cols-2 gap-8 items-center ${event.side === 'left' ? 'md:grid-flow-dense' : ''
                      }`}
                  >
                    {/* Text side */}
                    <div
                      className={`${event.side === 'left'
                          ? 'md:col-start-2 md:text-left md:pl-12'
                          : 'md:text-right md:pr-12'
                        }`}
                    >
                      <span
                        className="inline-block text-xs font-sans font-semibold uppercase tracking-[0.2em] mb-3 px-3 py-1 rounded-full"
                        style={{
                          background: 'rgba(255,180,200,0.2)',
                          border: '1px solid rgba(255,180,200,0.4)',
                          color: '#ef4065',
                          ...getFieldStyle(event.time)
                        }}
                      >
                        {getFieldValue(event.time)}
                      </span>
                      <h3 className="font-display text-3xl md:text-4xl text-petal-800 mb-3" style={getFieldStyle(event.title)}>
                        {getFieldValue(event.title)}
                      </h3>
                      <p className="text-petal-600 font-serif leading-relaxed" style={getFieldStyle(event.description)}>
                        {getFieldValue(event.description)}
                      </p>
                    </div>

                    {/* Image side */}
                    <div className={event.side === 'left' ? 'md:col-start-1' : ''}>
                      <div
                        className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                        style={{
                          boxShadow: '0 12px 40px rgba(255,100,140,0.18)',
                        }}
                      >
                        <Image
                          src={event.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'}
                          alt={getFieldValue(event.title) || 'Event image'}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {/* Pink overlay tint */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{ background: 'linear-gradient(135deg, rgba(255,150,180,0.1) 0%, transparent 60%)' }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}
