'use client';

import { motion } from 'framer-motion';

export function PetalField({
  enabled = true,
  count = 6,
  color = 'var(--el-accent-soft)',
}: {
  enabled?: boolean;
  count?: number;
  color?: string;
}) {
  if (!enabled) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1, 0.5], y: [-20, 20, -20] }}
          transition={{ duration: 6 + i, repeat: Infinity, delay: i * 1.2, ease: 'easeInOut' }}
          className="absolute"
          style={{
            color,
            left: `${10 + i * 15}%`,
            top: `${15 + (i % 3) * 25}%`,
            fontSize: `${14 + (i % 3) * 8}px`,
          }}
        >
          ✿
        </motion.div>
      ))}
    </div>
  );
}
