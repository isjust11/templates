import type { CSSProperties } from 'react';

export type FieldConfig = {
  display?: string;
  color?: string;
  font?: string;
  size?: string;
};

/** Admin stores each slot either as a raw value or wrapped `{ type, value, defaul, config }`. */
export type Field<T> = T | { type?: string; value?: T; defaul?: T; config?: FieldConfig; id?: number };

export type GiftItem = {
  owner: Field<string>;
  bank: Field<string>;
  accountNumber: Field<string>;
  qrImage?: Field<string>;
};

/** Typed slot payload (`slots.schema.json`). */
export type LoveJourneyData = {
  theme?: unknown;
  coverImage?: Field<string>;
  groomName: Field<string>;
  brideName: Field<string>;
  eventDate: Field<string>;
  eventDateDisplay?: Field<string>;
  venue: Field<string>;
  address?: Field<string>;
  mapsUrl?: Field<string>;
  greeting?: Field<string>;
  welcomeLines?: Field<string[]>;
  groomPhoto?: Field<string>;
  bridePhoto?: Field<string>;
  coupleIntro?: Field<string>;
  album?: Field<Array<string | { url?: Field<string>; image?: Field<string> }>>;
  videoUrl?: Field<string>;
  gifts?: Field<GiftItem[]>;
  rsvpDeadline?: Field<string>;
  footerMessage?: Field<string>;
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

/** `Thứ 3, Ngày 24 tháng 11, 2026` / `Tuesday, November 24, 2026` */
export function longDate(date: Date | null, lang: 'vi' | 'en'): string {
  if (!date) return '';
  if (lang === 'en') {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  }
  const day = date.getDay();
  const weekday = day === 0 ? 'Chủ nhật' : `Thứ ${day + 1}`;
  return `${weekday}, Ngày ${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
}

export function clockTime(date: Date | null): string {
  if (!date) return '';
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function mapsEmbedUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Accepts watch, short, youtu.be, shorts and embed links; anything else plays as given. */
export function youtubeEmbedUrl(raw: string): string {
  if (!raw) return '';
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\.|^m\./, '');
    let id = '';
    if (host === 'youtu.be') id = url.pathname.slice(1);
    else if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      id = url.searchParams.get('v') || url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]+)/)?.[1] || '';
    }
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : raw;
  } catch {
    return '';
  }
}

const DICT = {
  vi: {
    youAreInvited: 'Bạn nhận được một thiệp cưới',
    dearGuest: 'Gửi',
    open: 'Mở thiệp',
    theCouple: 'The couple',
    groom: 'Chú rể',
    bride: 'Cô dâu',
    album: 'Album ảnh',
    movie: 'Movie',
    location: 'Location',
    directions: 'Chỉ đường',
    gift: 'Gift',
    giftBox: 'Hộp mừng cưới',
    giftHint: 'Chạm vào phong bì để mở',
    giftIntro: 'Cảm ơn tấm lòng của bạn dành cho chúng mình.',
    copy: 'Sao chép',
    copied: 'Đã chép',
    rsvp: 'Xác nhận tham dự',
    rsvpBefore: 'Vui lòng phản hồi trước',
    fullName: 'Họ và tên',
    namePlaceholder: 'Nhập tên của bạn',
    willYouAttend: 'Bạn sẽ tham dự chứ?',
    attending: 'Có, tôi sẽ tham dự',
    declining: 'Tôi bận, rất tiếc không thể tham dự',
    guests: 'Số người đi cùng (kể cả bạn)',
    send: 'Gửi xác nhận',
    sending: 'Đang gửi…',
    thanksYes: 'Cảm ơn bạn! Hẹn gặp bạn trong ngày vui.',
    thanksNo: 'Cảm ơn bạn đã báo. Chúng mình sẽ nhớ đến bạn.',
    previewNote: 'Chế độ xem trước — phản hồi không được lưu.',
    errorGeneric: 'Đã xảy ra lỗi. Vui lòng thử lại.',
    nameRequired: 'Vui lòng nhập họ tên.',
    sendWish: 'Gửi lời chúc',
    wishTitle: 'Gửi lời chúc đến cô dâu chú rể',
    wishName: 'Tên của bạn',
    wishMessage: 'Lời chúc',
    wishPlaceholder: 'Chúc hai bạn trăm năm hạnh phúc…',
    wishRequired: 'Vui lòng nhập lời chúc.',
    wishSent: 'Cảm ơn bạn! Lời chúc sẽ hiển thị sau khi cô dâu chú rể duyệt.',
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    menu: 'Mục lục',
    close: 'Đóng',
    prev: 'Ảnh trước',
    next: 'Ảnh sau',
    thankYou: 'Thank you',
    sampleWishes: 'Chúc mừng hạnh phúc hai bạn!|Trăm năm hạnh phúc, sớm có tin vui nhé!|Chúc hai bạn mãi yêu thương như ngày đầu.',
  },
  en: {
    youAreInvited: 'You have a wedding invitation',
    dearGuest: 'Dear',
    open: 'Open invitation',
    theCouple: 'The couple',
    groom: 'Groom',
    bride: 'Bride',
    album: 'Album',
    movie: 'Movie',
    location: 'Location',
    directions: 'Directions',
    gift: 'Gift',
    giftBox: 'Wedding gift box',
    giftHint: 'Tap the envelope to open',
    giftIntro: 'Thank you for your kindness.',
    copy: 'Copy',
    copied: 'Copied',
    rsvp: 'RSVP',
    rsvpBefore: 'Kindly reply before',
    fullName: 'Full name',
    namePlaceholder: 'Your name',
    willYouAttend: 'Will you attend?',
    attending: 'Yes, I will be there',
    declining: 'Sorry, I cannot make it',
    guests: 'Party size (including you)',
    send: 'Send reply',
    sending: 'Sending…',
    thanksYes: 'Thank you! See you on the day.',
    thanksNo: 'Thank you for letting us know. You will be missed.',
    previewNote: 'Preview mode — replies are not saved.',
    errorGeneric: 'Something went wrong. Please try again.',
    nameRequired: 'Please enter your name.',
    sendWish: 'Send wishes',
    wishTitle: 'Send your wishes to the couple',
    wishName: 'Your name',
    wishMessage: 'Your wishes',
    wishPlaceholder: 'Wishing you a lifetime of love…',
    wishRequired: 'Please write a message.',
    wishSent: 'Thank you! Your wish appears once the couple approves it.',
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    menu: 'Menu',
    close: 'Close',
    prev: 'Previous photo',
    next: 'Next photo',
    thankYou: 'Thank you',
    sampleWishes: 'Congratulations to you both!|Wishing you a lifetime of happiness.|May your love grow stronger every day.',
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
