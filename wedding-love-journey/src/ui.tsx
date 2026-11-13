'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { HeartLine } from './Botanicals';

export const EASE = [0.22, 1, 0.36, 1] as const;

export function Fade({
  children,
  delay = 0,
  y = 26,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Bottom sheet inside the invite column. */
export function Sheet({
  open,
  onClose,
  title,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  closeLabel: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="lj-sheet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="lj-sheet__panel"
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="lj-sheet__close" aria-label={closeLabel} onClick={onClose}>
              ×
            </button>
            {title ? <h3 className="lj-sheet__title">{title}</h3> : null}
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <Fade className="lj-title">
      <span className="lj-title__icon">
        <HeartLine size={17} />
      </span>
      <h2 className="lj-title__text">{children}</h2>
      {sub ? <p className="lj-title__sub">{sub}</p> : null}
    </Fade>
  );
}
