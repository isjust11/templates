export type FieldConfig = {
  display?: string;
  color?: string;
  font?: string;
  size?: string;
};

export type ConfigurableField<T> = {
  type: string;
  defaul?: T;
  value?: T;
  config?: FieldConfig;
};

export type ScheduleItem = {
  time: ConfigurableField<string>;
  title: ConfigurableField<string>;
  description: ConfigurableField<string>;
  image?: string;
  side: 'left' | 'right';
};

/** Typed slot payload for this template repo (`slots.schema.json`). */
export type TemplateEventData = {
  coverImage?: string;
  backgroundImage?: string;
  album?: string[];
  brideName: ConfigurableField<string>;
  groomName: ConfigurableField<string>;
  eventDate: ConfigurableField<string>;
  eventDateDisplay: ConfigurableField<string>;
  city: ConfigurableField<string>;
  venue: ConfigurableField<string>;
  hosts: ConfigurableField<string>;
  mapsUrl: ConfigurableField<string>;
  welcomeLines: ConfigurableField<string[]>;
  welcomeHighlightLineIndex: number;
  scheduleIntro: ConfigurableField<string>;
  schedule: ScheduleItem[];
  eventNote: ConfigurableField<string>;
  footerMessage: ConfigurableField<string>;
  footerCredit: ConfigurableField<string>;
  locale: string;
};

export type SampleId = 'my-wedding';

export const SAMPLE_META: Record<
  SampleId,
  { label: string; description: string }
> = {
  'my-wedding': {
    label: 'Minh Anh & Hoàng Nam',
    description: 'Sample Việt Nam — chứng minh đổ data theo typed slots',
  },
};

export const SAMPLES: Record<SampleId, TemplateEventData> = {
  'my-wedding': {
    brideName: { type: 'TEXT', defaul: 'Minh Anh 13', config: {} },
    groomName: { type: 'TEXT', defaul: 'Hoàng Nam', config: {} },
    eventDate: { type: 'DATE', defaul: '2026-10-18T17:30:00', config: {} },
    eventDateDisplay: { type: 'TEXT', defaul: '18 tháng 10, 2026', config: {} },
    city: { type: 'TEXT', defaul: 'Thành phố Hồ Chí Minh', config: {} },
    venue: { type: 'TEXT', defaul: 'The Reverie Saigon', config: {} },
    hosts: { type: 'TEXT', defaul: 'Gia đình hai họ', config: {} },
    mapsUrl: { type: 'TEXT', defaul: 'https://maps.google.com/?q=The+Reverie+Saigon', config: {} },
    welcomeLines: {
      type: 'TEXT_ARRAY',
      defaul: [
        'Kính gửi quý khách,',
        'gia đình chúng tôi trân trọng kính mời',
        '',
        'Hoàng Nam & Minh Anh',
        '',
        'đến dự lễ thành hôn và chung vui',
        'trong ngày trọng đại của hai con.',
        'Sự hiện diện của quý khách',
        'là niềm vinh hạnh lớn lao đối với chúng tôi.',
      ],
      config: {}
    },
    welcomeHighlightLineIndex: 3,
    scheduleIntro: {
      type: 'TEXT',
      defaul: 'Chương trình ngày cưới diễn ra tại The Reverie Saigon. Mong quý khách sắp xếp đến đúng giờ.',
      config: {}
    },
    schedule: [
      {
        time: { type: 'TEXT', defaul: '17:00', config: {} },
        title: { type: 'TEXT', defaul: 'Đón khách', config: {} },
        description: { type: 'TEXT', defaul: 'Welcome drink tại sảnh tầng 2.', config: {} },
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        side: 'left',
      },
      {
        time: { type: 'TEXT', defaul: '17:30', config: {} },
        title: { type: 'TEXT', defaul: 'Lễ thành hôn', config: {} },
        description: { type: 'TEXT', defaul: 'Nghi thức trao lời thề và trao nhẫn.', config: {} },
        image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
        side: 'right',
      },
      {
        time: { type: 'TEXT', defaul: '18:30', config: {} },
        title: { type: 'TEXT', defaul: 'Tiệc cưới', config: {} },
        description: { type: 'TEXT', defaul: 'Dùng tiệc và chung vui cùng hai họ.', config: {} },
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
        side: 'left',
      },
    ],
    eventNote: {
      type: 'TEXT',
      defaul: 'Toàn bộ sự kiện diễn ra tại một địa điểm. Có chỗ đậu xe. Mọi thắc mắc xin liên hệ gia đình.',
      config: {}
    },
    footerMessage: { type: 'TEXT', defaul: 'Rất hân hạnh được đón tiếp quý khách!', config: {} },
    footerCredit: { type: 'TEXT', defaul: 'Made with love • 2026', config: {} },
    locale: 'vi-VN',
  },
};

export function getSampleData(id: SampleId = 'my-wedding'): TemplateEventData {
  return SAMPLES[id];
}

export function isSampleId(value: string | null | undefined): value is SampleId {
  return value === 'my-wedding';
}

import React from 'react';

export function getFieldValue<T>(field: ConfigurableField<T> | T | undefined): T | undefined {
  if (field && typeof field === 'object' && 'type' in field) {
    const f = field as ConfigurableField<T>;
    return f.value ?? f.defaul;
  }
  return field as T | undefined;
}

export function getFieldStyle(field: ConfigurableField<any> | any | undefined): React.CSSProperties {
  if (field && typeof field === 'object' && 'type' in field && 'config' in field) {
    const f = field as ConfigurableField<any>;
    if (!f.config) return {};
    return {
      color: f.config.color,
      fontSize: f.config.size ? `${f.config.size}px` : undefined,
      display: (f.config.display === '0' || f.config.display === 'false') ? 'none' : undefined,
    };
  }
  return {};
}
