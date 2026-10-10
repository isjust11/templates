'use client';

import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#loi-moi', label: 'Lời mời' },
  { href: '#dem-nguoc', label: 'Đếm ngược' },
  { href: '#lich-trinh', label: 'Lịch trình' },
  { href: '#album', label: 'Album' },
  { href: '#rsvp', label: 'RSVP' },
];

export default function Navigation() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed inset-x-0 top-0 z-40 transition-all duration-300"
      style={{
        background: visible ? 'color-mix(in srgb, var(--el-bg) 88%, transparent)' : 'transparent',
        backdropFilter: visible ? 'blur(16px)' : undefined,
        borderBottom: visible ? '1px solid color-mix(in srgb, var(--el-ink) 8%, transparent)' : 'none',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#hero" className="font-display text-lg tracking-wide" style={{ color: 'var(--el-ink)' }}>
          W
        </a>
        <div className="hidden gap-6 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: 'var(--el-muted)' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
