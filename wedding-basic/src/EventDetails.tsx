'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTemplateData } from './TemplateDataProvider';

export default function EventDetails() {
  const {
    venue,
    city,
    eventDateDisplay,
    hosts,
    mapsUrl,
    eventNote,
    locale,
  } = useTemplateData();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isVi = locale.startsWith('vi');

  return (
    <section id="event-details" className="py-24 px-4 bg-cream-50">
      <div className="max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-display text-5xl md:text-7xl text-sage-800 mb-8">
            {isVi ? 'Địa điểm & thời gian' : 'Орын және уақыт'}
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <p className="text-sage-600 font-sans text-sm uppercase tracking-widest mb-2">
              {isVi ? 'Ngày' : 'Күні'}
            </p>
            <p
              className="text-sage-800 font-serif text-2xl md:text-3xl"
              data-slot="text.eventDateDisplay"
            >
              {eventDateDisplay}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <p className="text-sage-600 font-sans text-sm uppercase tracking-widest mb-2">
              {isVi ? 'Địa điểm' : 'Орны'}
            </p>
            <p
              className="text-sage-800 font-display text-3xl md:text-5xl mb-3"
              data-slot="text.venue"
            >
              {venue}
            </p>
            <p className="text-sage-600 font-serif text-lg" data-slot="text.city">
              {city}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <p className="text-sage-600 font-sans text-sm uppercase tracking-widest mb-2">
              {isVi ? 'Chủ hôn' : 'Той иелері'}
            </p>
            <p
              className="text-sage-800 font-display text-3xl md:text-5xl mb-3"
              data-slot="text.hosts"
            >
              {hosts}
            </p>
          </motion.div>

          <div className="w-20 h-px bg-sage-300 mx-auto mb-12" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <p
              className="text-sage-700 font-serif text-lg leading-relaxed mb-8"
              data-slot="text.eventNote"
            >
              {eventNote}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-slot="url.maps"
              className="inline-flex items-center gap-3 bg-sage-800 hover:bg-sage-900 text-cream-50 px-8 py-4 rounded-full font-sans text-sm font-medium uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {isVi ? 'Xem bản đồ' : 'Карта 2GIS'}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
