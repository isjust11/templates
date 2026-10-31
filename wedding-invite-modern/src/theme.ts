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
  fontDisplay: string;
  fontScript: string;
  fontBody: string;
  fontSans: string;
};

type ThemeBlob = Partial<ThemeTokens> & Record<string, unknown>;

/** Ivory / ink / mocha with calligraphic names. Every default family covers Vietnamese. */
export const WEDDING_MODERN_DEFAULT_THEME: ThemeTokens = {
  accent: '#8b5e45',
  accentSoft: '#d8c3b1',
  ink: '#1f1c19',
  muted: '#6f655c',
  bg: '#f5f1ea',
  bgSoft: '#ebe4d8',
  onAccent: '#f9f6f1',
  fontDisplay: '"Playfair Display", "Times New Roman", serif',
  fontScript: '"Great Vibes", "Playfair Display", cursive',
  fontBody: '"Be Vietnam Pro", system-ui, sans-serif',
  fontSans: '"Be Vietnam Pro", system-ui, sans-serif',
};

/** Axes requested per family. Unknown families load their regular face only. */
const FONT_AXES: Record<string, string> = {
  'Playfair Display': 'ital,wght@0,400;0,500;0,600;1,400;1,500',
  'Cormorant Garamond': 'ital,wght@0,300;0,400;0,500;1,300;1,400',
  'Be Vietnam Pro': 'wght@300;400;500;600',
  Manrope: 'wght@300;400;500;600',
  Lora: 'ital,wght@0,400;0,500;1,400',
  'DM Sans': 'wght@400;500;600',
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

/**
 * One Google Fonts stylesheet per family named first in each theme font token, so fonts typed in
 * admin load too. A family Google does not have fails on its own link without blocking the rest.
 */
export function fontStylesheets(tokens: ThemeTokens): string[] {
  const families = [tokens.fontDisplay, tokens.fontScript, tokens.fontBody, tokens.fontSans]
    .map((stack) => stack.split(',')[0]?.trim().replace(/^["']|["']$/g, '') || '')
    .filter((name) => name && !NOT_ON_GOOGLE.has(name.toLowerCase()));
  return Array.from(new Set(families)).map((name) => {
    const axes = FONT_AXES[name];
    const family = encodeURIComponent(name).replace(/%20/g, '+');
    return `https://fonts.googleapis.com/css2?family=${family}${axes ? `:${axes}` : ''}&display=swap`;
  });
}

/** Only the 囍 glyph, so the CJK font download stays tiny. */
export const DOUBLE_HAPPINESS_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@900&text=%E5%9B%8D&display=swap';

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
  const out = { ...WEDDING_MODERN_DEFAULT_THEME };
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
    '--el-font-display': t.fontDisplay,
    '--el-font-script': t.fontScript,
    '--el-font-body': t.fontBody,
    '--el-font-sans': t.fontSans,
    // Nest / legacy HTML template aliases
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
  gate: boolean;
  /** Falling blossom petals on the page and gold dust on the doors. */
  petals: boolean;
  hearts: boolean;
  autoScroll: boolean;
  autoScrollSpeed: 'slow' | 'normal' | 'fast';
};

/** Flags from `@eventlab/effects`. The envelope flag drives this template's door gate. */
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
