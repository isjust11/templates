'use client';

import type { CSSProperties, ReactNode } from 'react';

type ThemeInput = {
  accent?: string;
  accentSoft?: string;
  ink?: string;
  muted?: string;
  bg?: string;
  bgSoft?: string;
  onAccent?: string;
  fontDisplay?: string;
  fontScript?: string;
  fontBody?: string;
  fontSans?: string;
};

const DEFAULT: Required<ThemeInput> & { scale: Record<string, string> } = {
  accent: '#d1305b',
  accentSoft: '#f7aab7',
  ink: '#654732',
  muted: '#986a43',
  bg: '#faf8f3',
  bgSoft: '#f5f0e3',
  onAccent: '#ffffff',
  fontDisplay: '"Gloock", "Lora", serif',
  fontScript: '"Pinyon Script", cursive',
  fontBody: '"Lora", Georgia, serif',
  fontSans: '"DM Sans", system-ui, sans-serif',
  scale: {
    50: '#faf8f3',
    100: '#fce7eb',
    200: '#fad1d9',
    300: '#f7aab7',
    400: '#f27a91',
    500: '#e74c6b',
    600: '#d1305b',
    700: '#b0234d',
    800: '#932047',
    900: '#7d1f42',
  },
};

function readTheme(data?: Record<string, unknown> | null): ThemeInput {
  const raw = data?.theme;
  if (!raw || typeof raw !== 'object') return {};
  const obj = raw as Record<string, unknown>;
  if (obj.tokens && typeof obj.tokens === 'object') return obj.tokens as ThemeInput;
  if (obj.type === 'RAW' || obj.type === 'THEME') {
    const value = obj.value ?? obj.defaul;
    if (value && typeof value === 'object') return readTheme({ theme: value as Record<string, unknown> });
    return {};
  }
  return obj as ThemeInput;
}

function readStoredCss(data?: Record<string, unknown> | null): string {
  const raw = data?.theme;
  if (!raw || typeof raw !== 'object') return '';
  const obj = raw as Record<string, unknown>;
  const css = typeof obj.css === 'string' ? obj.css : '';
  return css.replace(/<\/style/gi, '');
}

function toVars(data?: Record<string, unknown> | null): CSSProperties {
  const t = { ...DEFAULT, ...readTheme(data) };
  const vars: Record<string, string> = {
    '--el-accent': t.accent,
    '--el-accent-soft': t.accentSoft,
    '--el-ink': t.ink,
    '--el-muted': t.muted,
    '--el-bg': t.bg,
    '--el-bg-soft': t.bgSoft,
    '--el-on-accent': t.onAccent,
    '--el-font-display': t.fontDisplay,
    '--el-font-script': t.fontScript,
    '--el-font-body': t.fontBody,
    '--el-font-sans': t.fontSans,
    '--el-primary-color': t.accent,
    '--el-primary': t.accent,
    '--el-background': t.bg,
    '--el-font-heading': t.fontDisplay,
  };
  Object.entries(t.scale).forEach(([step, hex]) => {
    vars[`--el-petal-${step}`] = hex;
  });
  return vars as CSSProperties;
}

export default function ThemeRoot({
  data,
  children,
}: {
  data?: Record<string, unknown> | null;
  children: ReactNode;
}) {
  const storedCss = readStoredCss(data);
  return (
    <div
      className="el-invite-root"
      data-el-theme="1"
      style={{
        ...toVars(data),
        color: 'var(--el-ink)',
        fontFamily: 'var(--el-font-body)',
        backgroundColor: 'var(--el-bg)',
      }}
    >
      {storedCss ? <style>{storedCss}</style> : null}
      {children}
    </div>
  );
}
