import type { CSSProperties } from 'react';

export type ThemeInput = {
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
  musicEnabled?: boolean;
  musicUrl?: string;
  effectConfetti?: boolean;
  effectPetals?: boolean;
  effectEnvelope?: boolean;
  colorMode?: 'light' | 'dark' | 'system';
  autoScroll?: boolean;
  autoScrollSpeed?: 'slow' | 'normal' | 'fast';
  css?: string;
};

export type InviteEffects = {
  musicEnabled: boolean;
  musicUrl: string;
  confetti: boolean;
  petals: boolean;
  envelope: boolean;
  colorMode: 'light' | 'dark' | 'system';
  autoScroll: boolean;
  autoScrollSpeed: 'slow' | 'normal' | 'fast';
};

export const MODERN_DEFAULT_THEME: Required<
  Pick<
    ThemeInput,
    | 'accent'
    | 'accentSoft'
    | 'ink'
    | 'muted'
    | 'bg'
    | 'bgSoft'
    | 'onAccent'
    | 'fontDisplay'
    | 'fontScript'
    | 'fontBody'
    | 'fontSans'
  >
> = {
  accent: '#161616',
  accentSoft: '#cfc6b8',
  ink: '#121212',
  muted: '#6f6a64',
  bg: '#f3f1ed',
  bgSoft: '#e7e2da',
  onAccent: '#f7f5f2',
  fontDisplay: '"Gloock", "Lora", serif',
  fontScript: '"Pinyon Script", cursive',
  fontBody: '"Lora", Georgia, serif',
  fontSans: '"DM Sans", system-ui, sans-serif',
};

function readThemeBlob(data?: Record<string, unknown> | null): ThemeInput {
  const raw = data?.theme;
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      return readThemeBlob({ theme: JSON.parse(raw) });
    } catch {
      return {};
    }
  }
  if (typeof raw !== 'object') return {};
  const obj = raw as Record<string, unknown>;
  const { tokens: _t, value: _v, defaul: _d, type: _type, id: _id, css: _css, ...siblings } = obj;
  let inner: ThemeInput = {};
  if (obj.tokens && typeof obj.tokens === 'object') inner = readThemeBlob({ theme: obj.tokens });
  else if ((obj.type === 'THEME' || obj.type === 'RAW') && (obj.value != null || obj.defaul != null)) {
    inner = readThemeBlob({ theme: obj.value ?? obj.defaul });
  } else inner = obj as ThemeInput;
  return { ...inner, ...(siblings as ThemeInput) };
}

function mix(hex: string, towardWhite: number): string {
  const raw = hex.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(raw)) return hex;
  const channel = (i: number) => parseInt(raw.slice(i, i + 2), 16);
  const blend = (n: number) => {
    const t = Math.max(-1, Math.min(1, towardWhite));
    const next = t >= 0 ? n + (255 - n) * t : n * (1 + t);
    return Math.max(0, Math.min(255, Math.round(next)))
      .toString(16)
      .padStart(2, '0');
  };
  return `#${blend(channel(0))}${blend(channel(2))}${blend(channel(4))}`;
}

export function resolveTheme(data?: Record<string, unknown> | null): ThemeInput & typeof MODERN_DEFAULT_THEME {
  const fromData = readThemeBlob(data);
  const accent = fromData.accent || MODERN_DEFAULT_THEME.accent;
  return {
    ...MODERN_DEFAULT_THEME,
    ...fromData,
    accent,
    accentSoft: fromData.accentSoft || mix(accent, 0.72),
    ink: fromData.ink || MODERN_DEFAULT_THEME.ink,
    muted: fromData.muted || MODERN_DEFAULT_THEME.muted,
    bg: fromData.bg || MODERN_DEFAULT_THEME.bg,
    bgSoft: fromData.bgSoft || MODERN_DEFAULT_THEME.bgSoft,
    onAccent: fromData.onAccent || MODERN_DEFAULT_THEME.onAccent,
  };
}

export function themeToCssVars(theme: ReturnType<typeof resolveTheme>): CSSProperties {
  const accent = theme.accent;
  const vars: Record<string, string> = {
    '--el-accent': accent,
    '--el-accent-soft': theme.accentSoft,
    '--el-ink': theme.ink,
    '--el-muted': theme.muted,
    '--el-bg': theme.bg,
    '--el-bg-soft': theme.bgSoft,
    '--el-on-accent': theme.onAccent,
    '--el-font-display': theme.fontDisplay,
    '--el-font-script': theme.fontScript,
    '--el-font-body': theme.fontBody,
    '--el-font-sans': theme.fontSans,
    '--el-primary': accent,
    '--el-primary-color': accent,
    '--el-background': theme.bg,
    '--el-font-heading': theme.fontDisplay,
    '--el-petal-50': mix(accent, 0.94),
    '--el-petal-100': mix(accent, 0.86),
    '--el-petal-200': mix(accent, 0.74),
    '--el-petal-300': theme.accentSoft,
    '--el-petal-400': mix(accent, 0.4),
    '--el-petal-500': mix(accent, 0.18),
    '--el-petal-600': accent,
    '--el-petal-700': mix(accent, -0.18),
    '--el-petal-800': theme.ink,
    '--el-petal-900': mix(accent, -0.45),
  };
  return vars as CSSProperties;
}

export function readStoredThemeCss(data?: Record<string, unknown> | null): string {
  const raw = data?.theme;
  if (!raw || typeof raw !== 'object') return '';
  const obj = raw as Record<string, unknown>;
  const direct = typeof obj.css === 'string' ? obj.css : '';
  const nested =
    obj.value && typeof obj.value === 'object' && typeof (obj.value as Record<string, unknown>).css === 'string'
      ? String((obj.value as Record<string, unknown>).css)
      : '';
  return (direct || nested).replace(/<\/style/gi, '');
}

function flagOn(value: unknown): boolean {
  return value === true || value === 'true' || value === 1 || value === '1';
}

export function readInviteEffects(data?: Record<string, unknown> | null): InviteEffects {
  const theme = readThemeBlob(data);
  const colorMode = theme.colorMode === 'dark' || theme.colorMode === 'system' ? theme.colorMode : 'light';
  const autoScrollSpeed =
    theme.autoScrollSpeed === 'slow' || theme.autoScrollSpeed === 'fast' ? theme.autoScrollSpeed : 'normal';
  return {
    musicEnabled: theme.musicEnabled !== false,
    musicUrl: typeof theme.musicUrl === 'string' ? theme.musicUrl.trim() : '',
    confetti: theme.effectConfetti !== false,
    petals: theme.effectPetals !== false,
    envelope: theme.effectEnvelope !== false,
    colorMode,
    autoScroll: flagOn(theme.autoScroll),
    autoScrollSpeed,
  };
}
