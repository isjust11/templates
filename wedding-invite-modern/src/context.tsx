'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Dict, ModernEventData } from './fields';

export type ModernContextValue = {
  data: ModernEventData;
  t: Dict;
  lang: 'vi' | 'en';
  intlLocale: string;
  eventDate: Date | null;
  groom: string;
  bride: string;
  eventSlug?: string;
  /** True once the gate is gone — hero intro waits for it so it plays where the guest can see it. */
  revealed: boolean;
  /** Reduced motion, data saver or a weak device: skip particles and parallax. */
  lowPower: boolean;
};

const ModernContext = createContext<ModernContextValue | null>(null);

export function ModernProvider({ value, children }: { value: ModernContextValue; children: ReactNode }) {
  return <ModernContext.Provider value={value}>{children}</ModernContext.Provider>;
}

export function useModern(): ModernContextValue {
  const ctx = useContext(ModernContext);
  if (!ctx) throw new Error('useModern must be used within ModernProvider');
  return ctx;
}

/** Starts false on the server and first client render, then resolves from the device. */
export function useLowPower(): boolean {
  const [low, setLow] = useState(false);
  useEffect(() => {
    const path = window.location.pathname || '';
    // Admin live preview + catalog demos should always show particle effects.
    if (path.startsWith('/preview') || path.startsWith('/template/')) {
      setLow(false);
      return;
    }
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = nav.connection?.saveData === true;
    // Chrome buckets deviceMemory to 0.5/1/2/4/8 — `2` alone is common mid-tier, not "weak".
    // Only skip particles when both CPU and memory signals are clearly constrained.
    const cores = nav.hardwareConcurrency ?? 8;
    const mem = nav.deviceMemory ?? 8;
    const weak = cores <= 2 && mem <= 2;
    setLow(reduced || saveData || weak);
  }, []);
  return low;
}
