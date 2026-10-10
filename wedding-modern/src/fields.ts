export function textOf(field: unknown): string {
  if (field == null) return '';
  if (typeof field === 'string' || typeof field === 'number') return String(field);
  if (typeof field === 'object') {
    const record = field as Record<string, unknown>;
    if ('value' in record || 'defaul' in record) {
      const inner = record.value ?? record.defaul;
      if (inner !== field) return textOf(inner);
    }
  }
  return '';
}

export function linesOf(field: unknown): string[] {
  if (Array.isArray(field)) return field.map((item) => textOf(item));
  if (field && typeof field === 'object') {
    const record = field as Record<string, unknown>;
    const inner = record.value ?? record.defaul;
    if (Array.isArray(inner)) return inner.map((item) => textOf(item));
  }
  const single = textOf(field);
  return single ? [single] : [];
}

export function listOf(field: unknown): unknown[] {
  if (Array.isArray(field)) return field;
  if (field && typeof field === 'object') {
    const record = field as Record<string, unknown>;
    const inner = record.value ?? record.defaul;
    if (Array.isArray(inner)) return inner;
  }
  return [];
}

export function albumUrls(album: unknown): string[] {
  if (Array.isArray(album)) {
    return album.flatMap((item) => {
      if (typeof item === 'string' && item.trim()) return [item.trim()];
      if (item && typeof item === 'object') {
        const record = item as Record<string, unknown>;
        const nested = record.url || record.image || record.src || record.value || record.defaul;
        if (typeof nested === 'string' && nested.trim()) return [nested.trim()];
        if (nested && typeof nested === 'object') return albumUrls(nested);
      }
      return [];
    });
  }
  if (album && typeof album === 'object') {
    const record = album as Record<string, unknown>;
    const inner = record.value ?? record.defaul;
    if (inner !== undefined && inner !== album) return albumUrls(inner);
  }
  return [];
}

export function initials(name: string): string {
  const letter = name.trim().charAt(0);
  return letter ? letter.toUpperCase() : '';
}
