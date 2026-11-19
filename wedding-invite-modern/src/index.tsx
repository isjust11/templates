'use client';

export { default } from './ModernTemplate';
export { resolveThemeTokens, themeToCssVars, WEDDING_MODERN_DEFAULT_THEME } from './theme';
export type { ThemeTokens } from './theme';
export type { ModernEventData } from './fields';

export const templateId = 'wedding-invite-modern' as const;

export const templateMeta = {
  id: templateId,
  name: 'Wedding Invite Modern',
  description: 'Editorial ivory / ink single-page wedding invite',
};
