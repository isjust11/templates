/**
 * Kho hiệu ứng. Template và form tạo sự kiện đọc danh mục này,
 * rồi ghi cờ bật/tắt vào `theme` theo `themeKey`.
 */
export type EffectKind = 'burst' | 'ambient' | 'gate' | 'scroll' | 'audio';

export type EffectOption =
  | { key: string; type: 'enum'; values: readonly string[]; defaultValue: string }
  | { key: string; type: 'text'; defaultValue: string };

export type EffectDefinition = {
  id: string;
  themeKey: string;
  name: string;
  description: string;
  kind: EffectKind;
  /** Khi theme chưa có key: true thì coi như bật (`!== false`). */
  defaultEnabled: boolean;
  options?: readonly EffectOption[];
};

export const EFFECT_CATALOG: readonly EffectDefinition[] = [
  {
    id: 'confetti',
    themeKey: 'effectConfetti',
    name: 'Confetti',
    description: 'Bùng hoa giấy khi khách mở thiệp.',
    kind: 'burst',
    defaultEnabled: true,
  },
  {
    id: 'petals',
    themeKey: 'effectPetals',
    name: 'Cánh hoa',
    description: 'Cánh hoa bay trên ảnh bìa.',
    kind: 'ambient',
    defaultEnabled: true,
  },
  {
    id: 'envelope',
    themeKey: 'effectEnvelope',
    name: 'Phong bì',
    description: 'Màn mở phong bì trước khi vào nội dung thiệp.',
    kind: 'gate',
    defaultEnabled: true,
  },
  {
    id: 'auto-scroll',
    themeKey: 'autoScroll',
    name: 'Tự cuộn',
    description: 'Trang tự trượt xuống sau khi mở thiệp.',
    kind: 'scroll',
    defaultEnabled: false,
    options: [
      { key: 'autoScrollSpeed', type: 'enum', values: ['slow', 'normal', 'fast'], defaultValue: 'normal' },
    ],
  },
  {
    id: 'music',
    themeKey: 'musicEnabled',
    name: 'Nhạc nền',
    description: 'Phát nhạc khi khách mở thiệp.',
    kind: 'audio',
    defaultEnabled: true,
    options: [{ key: 'musicUrl', type: 'text', defaultValue: '' }],
  },
];

export type ThemeFlags = Record<string, unknown> | null | undefined;

export function listEffects(): readonly EffectDefinition[] {
  return EFFECT_CATALOG;
}

export function getEffect(id: string): EffectDefinition | undefined {
  return EFFECT_CATALOG.find((effect) => effect.id === id);
}

function isExplicitlyOn(value: unknown): boolean {
  return value === true || value === 'true' || value === 1 || value === '1';
}

/** Đọc cờ trên object theme đã làm phẳng. */
export function isEffectEnabled(theme: ThemeFlags, id: string): boolean {
  const effect = getEffect(id);
  if (!effect) return false;
  const value = theme?.[effect.themeKey];
  if (effect.defaultEnabled) return value !== false;
  return isExplicitlyOn(value);
}

export function activeEffects(theme: ThemeFlags): EffectDefinition[] {
  return EFFECT_CATALOG.filter((effect) => isEffectEnabled(theme, effect.id));
}
