'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTemplateData } from './TemplateDataProvider';
import InlineSlotEditor from './InlineSlotEditor';
import { getFieldValue, getFieldStyle } from './types';

export default function EventDetails() {
  const { venue, city, eventDateDisplay, hosts, mapsUrl, eventNote } = useTemplateData();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const cards = [
    { label: 'Ngày', value: eventDateDisplay, slot: 'eventDateDisplay', editorLabel: 'Ngày hiển thị', icon: '📅' },
    { label: 'Địa điểm', value: venue, slot: 'venue', editorLabel: 'Tên địa điểm', icon: '📍' },
    { label: 'Thành phố', value: city, slot: 'city', editorLabel: 'Thành phố', icon: '🏙️' },
    { label: 'Chủ hôn', value: hosts, slot: 'hosts', editorLabel: 'Chủ trì / Đại diện', icon: '👨‍👩‍👧' },
  ];

  return (
    <section
      id="event-details"
      className="py-28 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #fff0f4 0%, #ffffff 100%)' }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #ffc9d9 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #ffb3c3 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-petal-400 mb-4 font-medium">Chi tiết</p>
          <h2 className="font-display text-5xl md:text-7xl text-petal-800 mb-5">
            Thông Tin
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #ffb3c3)' }} />
            <span className="text-petal-300 text-lg">❀</span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, #ffb3c3)' }} />
          </div>
        </motion.div>

        {/* Info cards grid */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {cards.map(({ label, value, slot, editorLabel, icon }, i) => (
            <motion.div
              key={slot}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              className="rounded-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,230,238,0.5) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,180,200,0.35)',
                boxShadow: '0 8px 32px rgba(255,100,140,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
            >
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-petal-400 mb-2 font-medium">
                {label}
              </p>
              <p
                className="font-display text-2xl md:text-3xl text-petal-800"
                style={getFieldStyle(value)}
                data-slot={`text.${slot}`}
              >
                <InlineSlotEditor slotKey={slot as never} label={editorLabel} value={value}>
                  {getFieldValue(value)}
                </InlineSlotEditor>
              </p>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        {eventNote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-10 max-w-2xl mx-auto"
          >
            <p className="text-petal-600 font-serif text-lg leading-relaxed italic" style={getFieldStyle(eventNote)} data-slot="text.eventNote">
              <InlineSlotEditor slotKey="eventNote" label="Ghi chú" type="textarea" value={eventNote}>
                {getFieldValue(eventNote)}
              </InlineSlotEditor>
            </p>
          </motion.div>
        )}

        {/* Map button */}
        {mapsUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <a
              href={getFieldValue(mapsUrl) as string}
              target="_blank"
              rel="noopener noreferrer"
              data-slot="url.maps"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-sans text-sm font-medium text-white uppercase tracking-wider transition-all duration-300 hover:shadow-petal-lg hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #ff9db7, #ef4065)',
                boxShadow: '0 6px 24px rgba(255,100,140,0.35)',
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Xem bản đồ
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
