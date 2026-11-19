'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Dict, LoveJourneyData } from './fields';

export type JourneyContextValue = {
  data: LoveJourneyData;
  t: Dict;
  lang: 'vi' | 'en';
  eventDate: Date | null;
  groom: string;
  bride: string;
  eventSlug?: string;
  isEditing: boolean;
  /** Reduced motion, data saver or a weak device: skip particles. */
  lowPower: boolean;
};

const JourneyContext = createContext<JourneyContextValue | null>(null);

export function JourneyProvider({ value, children }: { value: JourneyContextValue; children: ReactNode }) {
  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney(): JourneyContextValue {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error('useJourney must be used within JourneyProvider');
  return ctx;
}

/** Starts false on the server and first client render, then resolves from the device. */
export function useLowPower(): boolean {
  const [low, setLow] = useState(false);
  useEffect(() => {
    const path = window.location.pathname || '';
    if (path.startsWith('/preview') || path.startsWith('/template/')) {
      setLow(false);
      return;
    }
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = nav.connection?.saveData === true;
    const cores = nav.hardwareConcurrency ?? 8;
    const mem = nav.deviceMemory ?? 8;
    const weak = cores <= 2 && mem <= 2;
    setLow(reduced || saveData || weak);
  }, []);
  return low;
}
