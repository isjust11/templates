'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { TemplateEventData } from './types';

export interface TemplateDataContextType {
  data: TemplateEventData;
  isEditing?: boolean;
  onFieldChange?: (fieldKey: keyof TemplateEventData, value: unknown) => void;
  onUploadImage?: (file: File) => Promise<string>;
}

const TemplateDataContext = createContext<TemplateDataContextType | null>(null);

export function TemplateDataProvider({
  data,
  isEditing = false,
  onFieldChange,
  onUploadImage,
  children,
}: {
  data: TemplateEventData;
  isEditing?: boolean;
  onFieldChange?: (fieldKey: keyof TemplateEventData, value: unknown) => void;
  onUploadImage?: (file: File) => Promise<string>;
  children: ReactNode;
}) {
  return (
    <TemplateDataContext.Provider value={{ data, isEditing, onFieldChange, onUploadImage }}>
      {children}
    </TemplateDataContext.Provider>
  );
}

export function useTemplateData(): TemplateEventData {
  const context = useContext(TemplateDataContext);
  if (!context) {
    throw new Error('useTemplateData must be used within TemplateDataProvider');
  }
  return context.data;
}

export function useTemplateDataContext(): TemplateDataContextType {
  const context = useContext(TemplateDataContext);
  if (!context) {
    throw new Error('useTemplateDataContext must be used within TemplateDataProvider');
  }
  return context;
}
