'use client';

export { default } from './WeddingInviteTemplate';
export type { TemplateEventData, ScheduleItem } from './types';
export { SAMPLES, getSampleData } from './types';

export const templateId = 'wedding-basic' as const;

export const templateMeta = {
  id: templateId,
  name: 'Wedding Basic',
  description: 'Sage/cream single-page wedding invite',
};
