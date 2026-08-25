'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { TemplateEventData } from './types';

const TemplateDataContext = createContext<TemplateEventData | null>(null);

export function TemplateDataProvider({
  data,
  children,
}: {
  data: TemplateEventData;
  children: ReactNode;
}) {
  return (
    <TemplateDataContext.Provider value={data}>
      {children}
    </TemplateDataContext.Provider>
  );
}

export function useTemplateData(): TemplateEventData {
  const data = useContext(TemplateDataContext);
  if (!data) {
    throw new Error('useTemplateData must be used within TemplateDataProvider');
  }
  return data;
}
