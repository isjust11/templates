'use client';

import type { CSSProperties, ReactNode } from 'react';
import {
  resolveThemeTokens,
  themeToCssVars,
  type ThemeTokens,
  WEDDING_BASIC_DEFAULT_THEME,
} from './theme';
import type { TemplateEventData } from './types';

/**
 * Applies EventLab CSS theme tokens on the invite root.
 * All packages should wrap their UI in this (or equivalent) so Host Tailwind
 * petal/font utilities + inline var(--el-*) stay in sync.
 */
export default function ThemeRoot({
  data,
  preset = WEDDING_BASIC_DEFAULT_THEME,
  className = 'el-invite-root',
  style,
  children,
}: {
  data?: TemplateEventData | Record<string, unknown> | null;
  preset?: ThemeTokens;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const tokens = resolveThemeTokens(data, preset);
  const cssVars = themeToCssVars(tokens);

  return (
    <div
      className={className}
      data-el-theme="1"
      style={{
        ...cssVars,
        color: 'var(--el-ink)',
        fontFamily: 'var(--el-font-body)',
        backgroundColor: 'var(--el-bg)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
