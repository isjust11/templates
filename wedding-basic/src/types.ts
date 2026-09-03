export type ScheduleItem = {
  time: string;
  title: string;
  description: string;
  image: string;
  side: 'left' | 'right';
};

/** Typed slot payload for this template repo (`slots.schema.json`). */
export type TemplateEventData = {
  coverImage?: string;
  backgroundImage?: string;
  album?: string[];
  brideName: string;
  groomName: string;
  eventDate: string;
  eventDateDisplay: string;
  city: string;
  venue: string;
  hosts: string;
  mapsUrl: string;
  welcomeLines: string[];
  welcomeHighlightLineIndex: number;
  scheduleIntro: string;
  schedule: ScheduleItem[];
  eventNote: string;
  footerMessage: string;
  footerCredit: string;
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
    brideName: 'Minh Anh',
    groomName: 'Hoàng Nam',
    eventDate: '2026-10-18T17:30:00',
    eventDateDisplay: '18 tháng 10, 2026',
    city: 'Thành phố Hồ Chí Minh',
    venue: 'The Reverie Saigon',
    hosts: 'Gia đình hai họ',
    mapsUrl: 'https://maps.google.com/?q=The+Reverie+Saigon',
    welcomeLines: [
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
    welcomeHighlightLineIndex: 3,
    scheduleIntro:
      'Chương trình ngày cưới diễn ra tại The Reverie Saigon. Mong quý khách sắp xếp đến đúng giờ.',
    schedule: [
      {
        time: '17:00',
        title: 'Đón khách',
        description: 'Welcome drink tại sảnh tầng 2.',
        image:
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        side: 'left',
      },
      {
        time: '17:30',
        title: 'Lễ thành hôn',
        description: 'Nghi thức trao lời thề và trao nhẫn.',
        image:
          'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
        side: 'right',
      },
      {
        time: '18:30',
        title: 'Tiệc cưới',
        description: 'Dùng tiệc và chung vui cùng hai họ.',
        image:
          'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
        side: 'left',
      },
    ],
    eventNote:
      'Toàn bộ sự kiện diễn ra tại một địa điểm. Có chỗ đậu xe. Mọi thắc mắc xin liên hệ gia đình.',
    footerMessage: 'Rất hân hạnh được đón tiếp quý khách!',
    footerCredit: 'Made with love • 2026',
    locale: 'vi-VN',
  },
};

export function getSampleData(id: SampleId = 'my-wedding'): TemplateEventData {
  return SAMPLES[id];
}

export function isSampleId(value: string | null | undefined): value is SampleId {
  return value === 'my-wedding';
}
