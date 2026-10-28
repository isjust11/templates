import type { CSSProperties } from 'react';

export type FieldConfig = {
  display?: string;
  color?: string;
  font?: string;
  size?: string;
};

/** Admin stores each slot either as a raw value or wrapped `{ type, value, defaul, config }`. */
export type Field<T> = T | { type?: string; value?: T; defaul?: T; config?: FieldConfig; id?: number };

export type StoryItem = {
  date: Field<string>;
  title: Field<string>;
  description?: Field<string>;
  image?: Field<string>;
};

export type EventItem = {
  label: Field<string>;
  time: Field<string>;
  dateDisplay?: Field<string>;
  venue?: Field<string>;
  address?: Field<string>;
  mapsUrl?: Field<string>;
};

export type GiftItem = {
  owner: Field<string>;
  bank: Field<string>;
  accountNumber: Field<string>;
  qrImage?: Field<string>;
};

/** Typed slot payload (`slots.schema.json`). */
export type ModernEventData = {
  theme?: unknown;
  coverImage?: Field<string>;
  brideName: Field<string>;
  groomName: Field<string>;
  eventDate: Field<string>;
  eventDateDisplay: Field<string>;
  city: Field<string>;
  venue: Field<string>;
  address?: Field<string>;
  mapsUrl?: Field<string>;
  hosts?: Field<string>;
  quote?: Field<string>;
  welcomeLines?: Field<string[]>;
  groomFather?: Field<string>;
  groomMother?: Field<string>;
  groomAddress?: Field<string>;
  brideFather?: Field<string>;
  brideMother?: Field<string>;
  brideAddress?: Field<string>;
  groomPhoto?: Field<string>;
  bridePhoto?: Field<string>;
  groomBio?: Field<string>;
  brideBio?: Field<string>;
  story?: Field<StoryItem[]>;
  events?: Field<EventItem[]>;
  album?: Field<Array<string | { url?: Field<string>; image?: Field<string> }>>;
  dressCodeNote?: Field<string>;
  dressCodeColors?: Field<string[]>;
  gifts?: Field<GiftItem[]>;
  rsvpDeadline?: Field<string>;
  footerMessage?: Field<string>;
  footerCredit?: Field<string>;
  locale?: Field<string>;
};

function isWrapped(field: unknown): field is { value?: unknown; defaul?: unknown; config?: FieldConfig } {
  return (
    !!field &&
    typeof field === 'object' &&
    !Array.isArray(field) &&
    ('type' in field || 'value' in field || 'defaul' in field)
  );
}

export function unwrap<T>(field: Field<T> | undefined): T | undefined {
  if (isWrapped(field)) {
    return (field.value ?? field.defaul) as T | undefined;
  }
  return field as T | undefined;
}

export function text(field: unknown): string {
  const value = unwrap(field as Field<unknown>);
  if (value == null) return '';
  if (typeof value === 'object') return '';
  return String(value).trim();
}

/** Arrays may arrive wrapped, raw, or as a JSON string from older admin builds. */
export function list<T>(field: Field<T[]> | undefined): T[] {
  const value = unwrap(field) as unknown;
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string' && value.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function imageUrl(item: unknown): string {
  if (typeof item === 'string') return item.trim();
  if (item && typeof item === 'object' && !isWrapped(item)) {
    const obj = item as { url?: unknown; image?: unknown; src?: unknown };
    return text(obj.url) || text(obj.image) || text(obj.src);
  }
  return text(item);
}

/** Per-field admin overrides (color / font / size / hide). */
export function fieldStyle(field: unknown): CSSProperties {
  if (!isWrapped(field) || !field.config) return {};
  const { color, font, size, display } = field.config;
  const fontSize =
    size == null || size === '' ? undefined : /^\d+(\.\d+)?$/.test(String(size)) ? `${size}px` : String(size);
  return {
    color: color || undefined,
    fontFamily: font || undefined,
    fontSize,
    display: display === '0' || display === 'false' ? 'none' : undefined,
  };
}

export function parseEventDate(field: unknown): Date | null {
  const raw = text(field);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** `18 · 10 · 2026` */
export function dotDate(date: Date | null): string {
  if (!date) return '';
  return `${pad(date.getDate())} · ${pad(date.getMonth() + 1)} · ${date.getFullYear()}`;
}

export function weekday(date: Date | null, locale: string): string {
  if (!date) return '';
  return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
}

function toCalendarStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function googleCalendarUrl(opts: {
  title: string;
  start: Date;
  hours?: number;
  location?: string;
  details?: string;
}): string {
  const end = new Date(opts.start.getTime() + (opts.hours ?? 4) * 3_600_000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    dates: `${toCalendarStamp(opts.start)}/${toCalendarStamp(end)}`,
  });
  if (opts.location) params.set('location', opts.location);
  if (opts.details) params.set('details', opts.details);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function mapsEmbedUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const DICT = {
  vi: {
    theWeddingOf: 'Lễ thành hôn của',
    dearGuest: 'Trân trọng kính mời',
    youAreInvited: 'Bạn đã nhận được một lời mời',
    open: 'Mở thiệp',
    tapToOpen: 'Chạm vào con dấu để mở thiệp',
    saveTheDate: 'Save the date',
    invitation: 'Lời mời',
    groomSide: 'Nhà trai',
    brideSide: 'Nhà gái',
    groom: 'Chú rể',
    bride: 'Cô dâu',
    theCouple: 'Cặp đôi',
    countdown: 'Đếm ngược',
    days: 'Ngày',
    hours: 'Giờ',
    minutes: 'Phút',
    seconds: 'Giây',
    happened: 'Ngày trọng đại đã đến',
    addToCalendar: 'Lưu vào lịch',
    ourStory: 'Chuyện của chúng mình',
    journey: 'Hành trình',
    schedule: 'Lịch trình',
    directions: 'Chỉ đường',
    ceremony: 'Lễ thành hôn',
    gallery: 'Khoảnh khắc',
    dressCode: 'Trang phục',
    gifts: 'Mừng cưới',
    giftBox: 'Hộp mừng cưới',
    giftsIntro: 'Sự hiện diện của bạn là món quà quý giá nhất. Nếu muốn gửi lời chúc qua quà mừng, bạn có thể dùng thông tin dưới đây.',
    showGifts: 'Xem thông tin mừng cưới',
    hideGifts: 'Ẩn thông tin',
    copy: 'Sao chép',
    copied: 'Đã chép',
    rsvp: 'Xác nhận tham dự',
    rsvpBefore: 'Vui lòng phản hồi trước',
    yourName: 'Tên của bạn',
    attending: 'Sẽ tham dự',
    declining: 'Rất tiếc, không thể',
    guests: 'Số người',
    message: 'Lời nhắn cho cô dâu chú rể',
    send: 'Gửi phản hồi',
    sending: 'Đang gửi…',
    thanks: 'Cảm ơn bạn đã phản hồi!',
    thanksYes: 'Hẹn gặp bạn trong ngày vui.',
    thanksNo: 'Chúng mình sẽ nhớ đến bạn trong ngày vui.',
    previewNote: 'Chế độ xem trước — phản hồi không được lưu.',
    errorGeneric: 'Đã xảy ra lỗi. Vui lòng thử lại.',
    nameRequired: 'Vui lòng nhập tên.',
    thankYou: 'Cảm ơn',
    music: 'Nhạc nền',
    close: 'Đóng',
    prev: 'Ảnh trước',
    next: 'Ảnh sau',
  },
  en: {
    theWeddingOf: 'The wedding of',
    dearGuest: 'Dear',
    youAreInvited: 'You are invited',
    open: 'Open invitation',
    tapToOpen: 'Tap the seal to open',
    saveTheDate: 'Save the date',
    invitation: 'Invitation',
    groomSide: "Groom's family",
    brideSide: "Bride's family",
    groom: 'Groom',
    bride: 'Bride',
    theCouple: 'The couple',
    countdown: 'Countdown',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    happened: 'The big day is here',
    addToCalendar: 'Add to calendar',
    ourStory: 'Our story',
    journey: 'The journey',
    schedule: 'Schedule',
    directions: 'Directions',
    ceremony: 'Ceremony',
    gallery: 'Moments',
    dressCode: 'Dress code',
    gifts: 'Gifts',
    giftBox: 'Wedding gift',
    giftsIntro: 'Your presence is the greatest gift. If you wish to send a gift, the details are below.',
    showGifts: 'Show gift details',
    hideGifts: 'Hide details',
    copy: 'Copy',
    copied: 'Copied',
    rsvp: 'RSVP',
    rsvpBefore: 'Kindly reply before',
    yourName: 'Your name',
    attending: 'Joyfully accept',
    declining: 'Regretfully decline',
    guests: 'Guests',
    message: 'A note for the couple',
    send: 'Send reply',
    sending: 'Sending…',
    thanks: 'Thank you for your reply!',
    thanksYes: 'See you on the day.',
    thanksNo: 'You will be missed.',
    previewNote: 'Preview mode — replies are not saved.',
    errorGeneric: 'Something went wrong. Please try again.',
    nameRequired: 'Please enter your name.',
    thankYou: 'Thank you',
    music: 'Music',
    close: 'Close',
    prev: 'Previous photo',
    next: 'Next photo',
  },
} as const;

export type Dict = { [K in keyof (typeof DICT)['vi']]: string };

export function resolveLocale(field: unknown): { lang: 'vi' | 'en'; intl: string } {
  const raw = text(field) || 'vi-VN';
  const lang = raw.toLowerCase().startsWith('en') ? 'en' : 'vi';
  return { lang, intl: raw };
}

export function dictFor(lang: 'vi' | 'en'): Dict {
  return DICT[lang];
}
