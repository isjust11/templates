import type { CSSProperties } from 'react';
import { isEffectEnabled } from '@eventlab/effects/catalog';

export type ThemeTokens = {
  accent: string;
  accentSoft: string;
  ink: string;
  muted: string;
  bg: string;
  bgSoft: string;
  onAccent: string;
  cta: string;
  fontDisplay: string;
  fontScript: string;
  fontBody: string;
  fontSans: string;
  fontRound: string;
};

type ThemeBlob = Partial<ThemeTokens> & Record<string, unknown>;

/** Sage, pale lime panels and a burgundy button. Every default family covers Vietnamese. */
export const LOVE_JOURNEY_DEFAULT_THEME: ThemeTokens = {
  accent: '#5a785e',
  accentSoft: '#eaf2d0',
  ink: '#262626',
  muted: '#5f6660',
  bg: '#ffffff',
  bgSoft: '#eef2e4',
  onAccent: '#ffffff',
  cta: '#7b2236',
  fontDisplay: '"Spectral", "Times New Roman", serif',
  fontScript: '"Dancing Script", cursive',
  fontBody: '"Spectral", "Times New Roman", serif',
  fontSans: '"Roboto", system-ui, sans-serif',
  fontRound: '"Comfortaa", "Roboto", sans-serif',
};

const FONT_KEYS = ['fontDisplay', 'fontScript', 'fontBody', 'fontSans', 'fontRound'] as const;

/** Axes requested per family. Unknown families load their regular face only. */
const FONT_AXES: Record<string, string> = {
  Spectral: 'ital,wght@0,300;0,400;0,500;0,600;1,400',
  'Dancing Script': 'wght@400;500;600',
  Roboto: 'wght@300;400;500;700',
  Comfortaa: 'wght@400;600;700',
  'Playfair Display': 'ital,wght@0,400;0,500;0,600;1,400',
  'Be Vietnam Pro': 'wght@300;400;500;600',
};

const NOT_ON_GOOGLE = new Set([
  'serif',
  'sans-serif',
  'cursive',
  'monospace',
  'system-ui',
  'times new roman',
  'georgia',
  'arial',
  'helvetica',
]);

/** One Google Fonts stylesheet per family named first in each font token, so fonts typed in admin load too. */
export function fontStylesheets(tokens: ThemeTokens): string[] {
  const families = FONT_KEYS.map((key) => tokens[key])
    .map((stack) => stack.split(',')[0]?.trim().replace(/^["']|["']$/g, '') || '')
    .filter((name) => name && !NOT_ON_GOOGLE.has(name.toLowerCase()));
  return Array.from(new Set(families)).map((name) => {
    const axes = FONT_AXES[name];
    const family = encodeURIComponent(name).replace(/%20/g, '+');
    return `https://fonts.googleapis.com/css2?family=${family}${axes ? `:${axes}` : ''}&display=swap`;
  });
}

/** Accepts the shapes admin stores on `eventData.theme`: flat, `{ tokens }`, or `{ type: 'THEME', value }`. */
function readThemeBlob(raw: unknown): ThemeBlob {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      return readThemeBlob(JSON.parse(raw));
    } catch {
      return {};
    }
  }
  if (typeof raw !== 'object') return {};
  const obj = raw as Record<string, unknown>;
  const { tokens, value, defaul, type, id: _id, css: _css, ...siblings } = obj;
  let inner: ThemeBlob = {};
  if (tokens && typeof tokens === 'object') {
    inner = readThemeBlob(tokens);
  } else if (type === 'RAW' || type === 'THEME') {
    inner = readThemeBlob(value ?? defaul);
  } else {
    return obj as ThemeBlob;
  }
  return { ...inner, ...(siblings as ThemeBlob) };
}

export function readTheme(data: Record<string, unknown> | null | undefined): ThemeBlob {
  return readThemeBlob(data?.theme);
}

export function resolveThemeTokens(data: Record<string, unknown> | null | undefined): ThemeTokens {
  const blob = readTheme(data);
  const out = { ...LOVE_JOURNEY_DEFAULT_THEME };
  (Object.keys(out) as Array<keyof ThemeTokens>).forEach((key) => {
    const v = blob[key];
    if (typeof v === 'string' && v.trim()) out[key] = v.trim();
  });
  return out;
}

export function themeToCssVars(t: ThemeTokens): CSSProperties {
  return {
    '--el-accent': t.accent,
    '--el-accent-soft': t.accentSoft,
    '--el-ink': t.ink,
    '--el-muted': t.muted,
    '--el-bg': t.bg,
    '--el-bg-soft': t.bgSoft,
    '--el-on-accent': t.onAccent,
    '--el-cta': t.cta,
    '--el-font-display': t.fontDisplay,
    '--el-font-script': t.fontScript,
    '--el-font-body': t.fontBody,
    '--el-font-sans': t.fontSans,
    '--el-font-round': t.fontRound,
    '--el-primary-color': t.accent,
    '--el-primary': t.accent,
    '--el-background': t.bg,
    '--el-font-heading': t.fontDisplay,
  } as CSSProperties;
}

export function readStoredThemeCss(data: Record<string, unknown> | null | undefined): string {
  const raw = data?.theme;
  if (!raw || typeof raw !== 'object') return '';
  const obj = raw as Record<string, unknown>;
  const nested = obj.value && typeof obj.value === 'object' ? (obj.value as Record<string, unknown>).css : '';
  const css = typeof obj.css === 'string' ? obj.css : typeof nested === 'string' ? nested : '';
  return css.replace(/<\/style/gi, '');
}

export type InviteEffects = {
  musicEnabled: boolean;
  musicUrl: string;
  confetti: boolean;
  /** Envelope cover before the page. */
  gate: boolean;
  /** Falling leaves and petals. */
  petals: boolean;
  /** Butterflies and a few hearts drifting up. */
  hearts: boolean;
  autoScroll: boolean;
  autoScrollSpeed: 'slow' | 'normal' | 'fast';
};

export function readInviteEffects(data: Record<string, unknown> | null | undefined): InviteEffects {
  const theme = readTheme(data);
  const speed = theme.autoScrollSpeed;
  return {
    musicEnabled: isEffectEnabled(theme, 'music'),
    musicUrl: typeof theme.musicUrl === 'string' ? theme.musicUrl.trim() : '',
    confetti: isEffectEnabled(theme, 'confetti'),
    gate: isEffectEnabled(theme, 'envelope'),
    petals: isEffectEnabled(theme, 'petals'),
    hearts: isEffectEnabled(theme, 'hearts'),
    autoScroll: isEffectEnabled(theme, 'auto-scroll'),
    autoScrollSpeed: speed === 'slow' || speed === 'fast' ? speed : 'normal',
  };
}
