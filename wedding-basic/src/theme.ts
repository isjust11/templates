import type { CSSProperties } from 'react';
import type { ConfigurableField, FieldConfig, TemplateEventData, ThemeInput } from './types';

export type { ThemeInput };

/** Canonical EventLab invite theme — shared by Host CSS vars + template packages. */
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
  scale: ThemeScale;
};

export type ThemeScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

/** Default skin for wedding-basic (petal / blush). */
export const WEDDING_BASIC_DEFAULT_THEME: ThemeTokens = {
  accent: '#ef4065',
  accentSoft: '#ffb3c3',
  ink: '#a82046',
  muted: '#c9244d',
  bg: '#fff5f7',
  bgSoft: '#fff0f4',
  onAccent: '#ffffff',
  fontDisplay: '"Gloock", "Lora", serif',
  fontScript: '"Pinyon Script", cursive',
  fontBody: '"Lora", Georgia, serif',
  fontSans: '"DM Sans", system-ui, sans-serif',
  scale: {
    50: '#fff5f7',
    100: '#ffeaee',
    200: '#ffd5de',
    300: '#ffb3c3',
    400: '#ff8aa2',
    500: '#ff6080',
    600: '#ef4065',
    700: '#c9244d',
    800: '#a82046',
    900: '#8e1f40',
  },
};

/** Champagne / romantic preset for wedding-invite2. */
export const WEDDING_INVITE2_DEFAULT_THEME: ThemeTokens = {
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

function clamp(n: number, min = 0, max = 255) {
  return Math.min(max, Math.max(min, Math.round(n)));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(raw)) return null;
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((v) => clamp(v).toString(16).padStart(2, '0'))
    .join('')}`;
}

/** Mix color toward white (t→1) or black (t→-1). */
export function mixHex(hex: string, towardWhite: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const t = Math.max(-1, Math.min(1, towardWhite));
  if (t >= 0) {
    return rgbToHex(
      rgb.r + (255 - rgb.r) * t,
      rgb.g + (255 - rgb.g) * t,
      rgb.b + (255 - rgb.b) * t,
    );
  }
  const k = 1 + t;
  return rgbToHex(rgb.r * k, rgb.g * k, rgb.b * k);
}

export function buildScaleFromAccent(accent: string, seed?: Partial<ThemeScale>): ThemeScale {
  return {
    50: seed?.[50] ?? mixHex(accent, 0.92),
    100: seed?.[100] ?? mixHex(accent, 0.85),
    200: seed?.[200] ?? mixHex(accent, 0.72),
    300: seed?.[300] ?? mixHex(accent, 0.55),
    400: seed?.[400] ?? mixHex(accent, 0.35),
    500: seed?.[500] ?? mixHex(accent, 0.12),
    600: seed?.[600] ?? accent,
    700: seed?.[700] ?? mixHex(accent, -0.18),
    800: seed?.[800] ?? mixHex(accent, -0.32),
    900: seed?.[900] ?? mixHex(accent, -0.45),
  };
}

function fieldConfig(field: unknown): FieldConfig | undefined {
  if (field && typeof field === 'object' && 'config' in field) {
    return (field as ConfigurableField<unknown>).config;
  }
  return undefined;
}

function readThemeBlob(data: Record<string, unknown> | TemplateEventData): ThemeInput {
  const raw = (data as Record<string, unknown>).theme;
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      return readThemeBlob({ theme: JSON.parse(raw) });
    } catch {
      return {};
    }
  }
  if (typeof raw === 'object' && raw !== null) {
    const obj = raw as Record<string, unknown>;
    const { tokens: _tokens, value: _value, defaul: _defaul, type: _type, id: _id, css: _css, ...siblings } = obj;
    let inner: ThemeInput = {};
    if (obj.tokens && typeof obj.tokens === 'object') {
      inner = readThemeBlob({ theme: obj.tokens });
    } else if ('type' in obj && (obj.type === 'RAW' || obj.type === 'THEME')) {
      const value = obj.value ?? obj.defaul;
      if (typeof value === 'string') {
        try {
          inner = readThemeBlob({ theme: JSON.parse(value) });
        } catch {
          inner = {};
        }
      } else if (value && typeof value === 'object') {
        inner = readThemeBlob({ theme: value });
      }
    } else {
      inner = obj as ThemeInput;
    }
    return { ...inner, ...(siblings as ThemeInput) };
  }
  return {};
}

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

function isEnabledFlag(value: unknown): boolean {
  return value === true || value === 'true' || value === 1 || value === '1';
}

/** Music, motion, color mode, and auto-scroll stored on `data.theme`. */
export function readInviteEffects(data?: Record<string, unknown> | TemplateEventData | null): InviteEffects {
  const theme = (data ? readThemeBlob(data) : {}) as ThemeInput;
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
    autoScroll: isEnabledFlag(theme.autoScroll),
    autoScrollSpeed,
  };
}

/** Stylesheet compiled and stored with the template (`data.theme.css`). */
export function readStoredThemeCss(data?: Record<string, unknown> | TemplateEventData | null): string {
  const raw = data ? (data as Record<string, unknown>).theme : undefined;
  if (!raw || typeof raw !== 'object') return '';
  const obj = raw as Record<string, unknown>;
  const direct = typeof obj.css === 'string' ? obj.css : '';
  const nested =
    obj.value && typeof obj.value === 'object' && typeof (obj.value as Record<string, unknown>).css === 'string'
      ? String((obj.value as Record<string, unknown>).css)
      : '';
  return (direct || nested).replace(/<\/style/gi, '');
}

/**
 * Resolve final tokens: defaults ← preset ← data.theme ← TemplateConfig hints on key fields.
 */
export function resolveThemeTokens(
  data?: Record<string, unknown> | TemplateEventData | null,
  preset: ThemeTokens = WEDDING_BASIC_DEFAULT_THEME,
): ThemeTokens {
  const fromData = data ? readThemeBlob(data) : {};
  const brideCfg = data ? fieldConfig((data as TemplateEventData).brideName) : undefined;
  const groomCfg = data ? fieldConfig((data as TemplateEventData).groomName) : undefined;

  const accent =
    fromData.accent ||
    brideCfg?.color ||
    groomCfg?.color ||
    preset.accent;

  const fontDisplay =
    fromData.fontDisplay ||
    brideCfg?.font ||
    groomCfg?.font ||
    preset.fontDisplay;

  const merged: Omit<ThemeTokens, 'scale'> = {
    accent,
    accentSoft: fromData.accentSoft || preset.accentSoft || mixHex(accent, 0.55),
    ink: fromData.ink || preset.ink || mixHex(accent, -0.32),
    muted: fromData.muted || preset.muted || mixHex(accent, -0.18),
    bg: fromData.bg || preset.bg || mixHex(accent, 0.92),
    bgSoft: fromData.bgSoft || preset.bgSoft || mixHex(accent, 0.88),
    onAccent: fromData.onAccent || preset.onAccent,
    fontDisplay,
    fontScript: fromData.fontScript || preset.fontScript,
    fontBody: fromData.fontBody || preset.fontBody,
    fontSans: fromData.fontSans || preset.fontSans,
  };

  const scale = buildScaleFromAccent(merged.accent, {
    ...preset.scale,
    ...fromData.scale,
    600: fromData.scale?.[600] || merged.accent,
    300: fromData.scale?.[300] || merged.accentSoft,
    800: fromData.scale?.[800] || merged.ink,
    700: fromData.scale?.[700] || merged.muted,
    50: fromData.scale?.[50] || merged.bg,
  });

  return { ...merged, scale };
}

/** Inline style map for `.el-invite-root` (and Nest HTML aliases). */
export function themeToCssVars(tokens: ThemeTokens): CSSProperties {
  const vars: Record<string, string> = {
    '--el-accent': tokens.accent,
    '--el-accent-soft': tokens.accentSoft,
    '--el-ink': tokens.ink,
    '--el-muted': tokens.muted,
    '--el-bg': tokens.bg,
    '--el-bg-soft': tokens.bgSoft,
    '--el-on-accent': tokens.onAccent,
    '--el-font-display': tokens.fontDisplay,
    '--el-font-script': tokens.fontScript,
    '--el-font-body': tokens.fontBody,
    '--el-font-sans': tokens.fontSans,
    // Nest / legacy HTML template aliases
    '--el-primary-color': tokens.accent,
    '--el-primary': tokens.accent,
    '--el-background': tokens.bg,
    '--el-font-heading': tokens.fontDisplay,
    '--el-font-body-legacy': tokens.fontBody,
    '--el-heading': tokens.fontDisplay,
    '--el-body': tokens.fontBody,
  };

  (Object.keys(tokens.scale) as Array<keyof ThemeScale>).forEach((step) => {
    vars[`--el-petal-${step}`] = tokens.scale[step];
  });

  return vars as CSSProperties;
}

export function getFieldConfig(field: unknown): FieldConfig | undefined {
  return fieldConfig(field);
}
