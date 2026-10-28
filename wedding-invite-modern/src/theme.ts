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

/** Ivory / ink / mocha — editorial default skin. */
export const WEDDING_MODERN_DEFAULT_THEME: ThemeTokens = {
  accent: '#8b5e45',
  accentSoft: '#d8c3b1',
  ink: '#1f1c19',
  muted: '#6f655c',
  bg: '#f5f1ea',
  bgSoft: '#ebe4d8',
  onAccent: '#f9f6f1',
  fontDisplay: '"Cormorant Garamond", "Times New Roman", serif',
  fontScript: '"Cormorant Garamond", "Times New Roman", serif',
  fontBody: '"Manrope", system-ui, sans-serif',
  fontSans: '"Manrope", system-ui, sans-serif',
};

/** Google Fonts for the default skin; custom fonts set via theme must be loaded by the host. */
export const WEDDING_MODERN_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Manrope:wght@300;400;500;600&display=swap';

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
  /** The `petals` ambient flag, rendered here as soft light motes. */
  sparkles: boolean;
  autoScroll: boolean;
  autoScrollSpeed: 'slow' | 'normal' | 'fast';
};

/** Flags from `@eventlab/effects`. The envelope flag drives this template's cover gate. */
export function readInviteEffects(data: Record<string, unknown> | null | undefined): InviteEffects {
  const theme = readTheme(data);
  const speed = theme.autoScrollSpeed;
  return {
    musicEnabled: isEffectEnabled(theme, 'music'),
    musicUrl: typeof theme.musicUrl === 'string' ? theme.musicUrl.trim() : '',
    confetti: isEffectEnabled(theme, 'confetti'),
    gate: isEffectEnabled(theme, 'envelope'),
    sparkles: isEffectEnabled(theme, 'petals'),
    autoScroll: isEffectEnabled(theme, 'auto-scroll'),
    autoScrollSpeed: speed === 'slow' || speed === 'fast' ? speed : 'normal',
  };
}
