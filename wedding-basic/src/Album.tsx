'use client';

import { motion } from 'framer-motion';
import { useTemplateData } from './TemplateDataProvider';

export default function Album() {
  const { album } = useTemplateData();

  if (!album || album.length === 0) return null;

  return (
    <section
      id="album"
      className="py-28 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fff5f7 100%)' }}
    >
      {/* Decorative top */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #ffb3c3 30%, #ffb3c3 70%, transparent)' }} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-sans text-xs uppercase tracking-[0.3em] text-petal-400 mb-4 font-medium"
          >
            Kỷ niệm
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-7xl text-petal-800 mb-5"
          >
            Album Cưới
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, #ffb3c3)' }} />
            <span className="text-petal-300 text-xl">✿</span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, #ffb3c3)' }} />
          </motion.div>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
          {album.map((imageUrl, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: (index % 3) * 0.1 }}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer
                ${index === 0 ? 'col-span-2 row-span-2' : ''}
                ${index === 3 ? 'col-span-2' : ''}
              `}
              style={{
                boxShadow: '0 8px 32px rgba(255,100,140,0.1)',
              }}
            >
              {/* Image */}
              <img
                src={imageUrl}
                alt={`Ảnh cưới ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                style={{ transform: 'scale(1)', transition: 'transform 0.7s ease' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
                loading="lazy"
              />

              {/* Subtle pink overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(255,100,140,0.12) 100%)' }}
              />

              {/* Glass hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none"
                style={{ background: 'rgba(255,220,232,0.15)', backdropFilter: 'blur(2px)' }}
              >
                <span className="text-white text-3xl drop-shadow-lg">✿</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
