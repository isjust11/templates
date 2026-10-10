'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-[11px] font-medium uppercase tracking-[0.42em]" style={{ color: 'var(--el-muted)' }}>
      {children}
    </p>
  );
}
