'use client';

export { default } from './WeddingInviteTemplate';
export { default as ThemeRoot } from './ThemeRoot';
export {
  resolveThemeTokens,
  themeToCssVars,
  WEDDING_BASIC_DEFAULT_THEME,
  WEDDING_INVITE2_DEFAULT_THEME,
  buildScaleFromAccent,
} from './theme';
export type { ThemeTokens, ThemeInput, ThemeScale } from './theme';

export const templateId = 'wedding-basic' as const;

export const templateMeta = {
  id: templateId,
  name: 'Wedding Basic',
  description: 'Sage/cream single-page wedding invite',
};
