'use client';

import { motion } from 'framer-motion';
import { albumUrls } from './fields';
import { Kicker, Reveal } from './motion';

export default function Album({ album }: { album: unknown }) {
  const photos = albumUrls(album);
  if (!photos.length) return null;

  return (
    <section id="album" className="px-5 py-28" style={{ background: 'var(--el-bg)' }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Kicker>Album</Kicker>
          <h2 className="mt-4 font-display text-5xl" style={{ color: 'var(--el-ink)' }}>
            Khoảnh khắc
          </h2>
        </Reveal>
        <div className="mt-12 columns-2 gap-3 md:columns-3">
          {photos.map((src, index) => (
            <motion.img
              key={`${src}-${index}`}
              src={src}
              alt=""
              className="mb-3 w-full break-inside-avoid object-cover"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
              whileHover={{ scale: 1.02 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
