'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { TemplateEventData } from './types';
import {
  resolveThemeTokens,
  type ThemeTokens,
  WEDDING_BASIC_DEFAULT_THEME,
} from './theme';

export interface TemplateDataContextType {
  data: TemplateEventData;
  theme: ThemeTokens;
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
  themePreset = WEDDING_BASIC_DEFAULT_THEME,
  children,
}: {
  data: TemplateEventData;
  isEditing?: boolean;
  onFieldChange?: (fieldKey: keyof TemplateEventData, value: unknown) => void;
  onUploadImage?: (file: File) => Promise<string>;
  themePreset?: ThemeTokens;
  children: ReactNode;
}) {
  const theme = useMemo(() => resolveThemeTokens(data, themePreset), [data, themePreset]);

  return (
    <TemplateDataContext.Provider
      value={{ data, theme, isEditing, onFieldChange, onUploadImage }}
    >
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

export function useTemplateTheme(): ThemeTokens {
  const context = useContext(TemplateDataContext);
  if (!context) {
    throw new Error('useTemplateTheme must be used within TemplateDataProvider');
  }
  return context.theme;
}

export function useTemplateDataContext(): TemplateDataContextType {
  const context = useContext(TemplateDataContext);
  if (!context) {
    throw new Error('useTemplateDataContext must be used within TemplateDataProvider');
  }
  return context;
}
