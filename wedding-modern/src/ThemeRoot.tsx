'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { readInviteEffects, readStoredThemeCss, resolveTheme, themeToCssVars } from './theme';

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

export default function ThemeRoot({
  data,
  children,
}: {
  data?: Record<string, unknown> | null;
  children: ReactNode;
}) {
  const theme = resolveTheme(data);
  const css = readStoredThemeCss(data);
  const effects = readInviteEffects(data);
  const color = useResolvedColorMode(effects.colorMode);

  return (
    <div
      className="el-invite-root"
      data-el-theme="1"
      data-el-color={color.resolved}
      style={{
        ...themeToCssVars(theme),
        color: 'var(--el-ink)',
        backgroundColor: 'var(--el-bg)',
        fontFamily: 'var(--el-font-sans)',
        minHeight: '100%',
      }}
    >
      {css ? <style>{css}</style> : null}
      {children}
      <button
        type="button"
        onClick={color.toggle}
        className="fixed bottom-6 left-6 z-[70] rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em]"
        style={{ background: 'var(--el-accent)', color: 'var(--el-on-accent)' }}
      >
        {color.resolved === 'dark' ? 'Sáng' : 'Tối'}
      </button>
    </div>
  );
}
