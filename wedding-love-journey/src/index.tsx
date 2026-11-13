'use client';

export { default } from './LoveJourney';
export { resolveThemeTokens, themeToCssVars, LOVE_JOURNEY_DEFAULT_THEME } from './theme';
export type { ThemeTokens } from './theme';
export type { LoveJourneyData } from './fields';

export const templateId = 'wedding-love-journey' as const;

export const templateMeta = {
  id: templateId,
  name: 'Love Journey',
  description: 'Sage botanical single-column wedding invite with album, movie, gift box and guest wishes',
};
