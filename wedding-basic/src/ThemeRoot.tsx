'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import {
  readInviteEffects,
  readStoredThemeCss,
  resolveThemeTokens,
  themeToCssVars,
  type ThemeTokens,
  WEDDING_BASIC_DEFAULT_THEME,
} from './theme';
import type { TemplateEventData } from './types';

function useResolvedColorMode(preference: 'light' | 'dark' | 'system') {
  const [systemDark, setSystemDark] = useState(false);
  const [override, setOverride] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    setOverride(null);
  }, [preference]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => setSystemDark(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  const resolved = override ?? (preference === 'system' ? (systemDark ? 'dark' : 'light') : preference);
  const toggle = () => setOverride(resolved === 'dark' ? 'light' : 'dark');
  return { resolved, toggle };
}

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
  const storedCss = readStoredThemeCss(data);
  const effects = readInviteEffects(data);
  const color = useResolvedColorMode(effects.colorMode);

  return (
    <div
      className={className}
      data-el-theme="1"
      data-el-color={color.resolved}
      style={{
        ...cssVars,
        color: 'var(--el-ink)',
        fontFamily: 'var(--el-font-body)',
        backgroundColor: 'var(--el-bg)',
        ...style,
      }}
    >
      {storedCss ? <style>{storedCss}</style> : null}
      {children}
      <button
        type="button"
        onClick={color.toggle}
        className="fixed bottom-6 left-6 z-[60] rounded-full border border-white/40 px-3 py-2 text-xs font-medium shadow-lg"
        style={{ background: 'var(--el-accent)', color: 'var(--el-on-accent)' }}
        aria-label={color.resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {color.resolved === 'dark' ? 'Sáng' : 'Tối'}
      </button>
    </div>
  );
}
