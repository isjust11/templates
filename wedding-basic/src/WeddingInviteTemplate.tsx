'use client';

import Hero from './Hero';
import WelcomeMessage from './WelcomeMessage';
import Countdown from './Countdown';
import WeddingDay from './WeddingDay';
import EventDetails from './EventDetails';
import Album from './Album';
import RsvpForm from './RsvpForm';
import Envelope from './Envelope';
import Navigation from './Navigation';
import ThemeRoot from './ThemeRoot';
import { TemplateDataProvider } from './TemplateDataProvider';
import InlineSlotEditor from './InlineSlotEditor';
import { getFieldValue } from './types';
import type { TemplateEventData } from './types';
import { readInviteEffects } from './theme';
import { useEffect, useState } from 'react';

function AutoScroll({ enabled, speed }: { enabled: boolean; speed: 'slow' | 'normal' | 'fast' }) {
  useEffect(() => {
    if (!enabled) return;
    const step = speed === 'slow' ? 0.25 : speed === 'fast' ? 1.6 : 0.9;
    const root = (document.scrollingElement || document.documentElement) as HTMLElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    let timer = 0;
    let stopped = false;
    const stop = () => {
      stopped = true;
    };
    const tick = () => {
      if (stopped) return;
      const max = root.scrollHeight - root.clientHeight;
      if (max <= 0) return;
      if (root.scrollTop >= max - 1) {
        stopped = true;
        return;
      }
      root.scrollTop = Math.min(max, root.scrollTop + step);
    };
    const start = window.setTimeout(() => {
      timer = window.setInterval(tick, 16);
    }, 700);
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('keydown', stop);
    return () => {
      stopped = true;
      root.style.scrollBehavior = previous;
      window.clearTimeout(start);
      window.clearInterval(timer);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', stop);
    };
  }, [enabled, speed]);
  return null;
}

/** Complete single-page template; all visible content comes from typed slot data. */
export default function WeddingInviteTemplate({
  data,
  eventSlug,
  isEditing = false,
  onFieldChange,
  onUploadImage,
}: {
  data: TemplateEventData;
  eventSlug?: string;
  isEditing?: boolean;
  onFieldChange?: (fieldKey: keyof TemplateEventData, value: unknown) => void;
  onUploadImage?: (file: File) => Promise<string>;
}) {
  const effects = readInviteEffects(data);
  const [inviteOpen, setInviteOpen] = useState(false);
  return (
    <ThemeRoot data={data}>
      <TemplateDataProvider
        data={data}
        isEditing={isEditing}
        onFieldChange={onFieldChange}
        onUploadImage={onUploadImage}
      >
        <AutoScroll
          enabled={effects.autoScroll && inviteOpen && !isEditing}
          speed={effects.autoScrollSpeed}
        />
        <Envelope
          brideName={getFieldValue(data.brideName) || ''}
          groomName={getFieldValue(data.groomName) || ''}
          coverImage={data.coverImage}
          onOpened={() => setInviteOpen(true)}
        >
          <Navigation />
          <main className="min-h-screen" style={{ background: 'var(--el-bg)' }}>
            <Hero />

            <WelcomeMessage />

            <section
              id="countdown"
              className="py-24 px-4 relative overflow-hidden"
              style={{
                background:
                  'linear-gradient(180deg, var(--el-bg-soft) 0%, var(--el-petal-200) 50%, var(--el-bg-soft) 100%)',
              }}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute top-0 left-1/3 w-64 h-64 rounded-full opacity-30"
                  style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent)' }}
                />
                <div
                  className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full opacity-25"
                  style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.6), transparent)' }}
                />
              </div>
              <div className="max-w-4xl mx-auto text-center relative">
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-petal-500 mb-4 font-medium">
                  Đếm ngược
                </p>
                <h2 className="font-display text-5xl md:text-7xl text-petal-800 mb-4">Đến Ngày Cưới</h2>
                <div className="flex items-center justify-center gap-3 mb-12">
                  <div
                    className="h-px w-16"
                    style={{ background: 'linear-gradient(to right, transparent, var(--el-accent-soft))' }}
                  />
                  <span className="text-petal-300 text-xl">♡</span>
                  <div
                    className="h-px w-16"
                    style={{ background: 'linear-gradient(to left, transparent, var(--el-accent-soft))' }}
                  />
                </div>
                <Countdown targetDate={getFieldValue(data.eventDate) || ''} />
              </div>
            </section>

            <WeddingDay />
            <EventDetails />
            <Album />
            <RsvpForm eventSlug={eventSlug} />

            <footer
              className="py-20 text-center relative overflow-hidden"
              style={{
                background:
                  'linear-gradient(135deg, var(--el-petal-800) 0%, var(--el-ink) 50%, var(--el-petal-900) 100%)',
              }}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-10"
                  style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent)' }}
                />
                <div
                  className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10"
                  style={{ background: 'radial-gradient(circle, var(--el-accent-soft), transparent)' }}
                />
              </div>

              <div className="max-w-4xl mx-auto px-4 relative">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div
                    className="h-px w-20"
                    style={{ background: 'linear-gradient(to right, transparent, var(--el-accent-soft))' }}
                  />
                  <span className="text-petal-200 font-script text-3xl">♡</span>
                  <div
                    className="h-px w-20"
                    style={{ background: 'linear-gradient(to left, transparent, var(--el-accent-soft))' }}
                  />
                </div>

                <p className="text-petal-200 text-base mb-5 font-serif italic leading-relaxed">
                  <InlineSlotEditor slotKey="footerMessage" label="Lời cảm ơn chân trang" value={data.footerMessage}>
                    {getFieldValue(data.footerMessage)}
                  </InlineSlotEditor>
                </p>

                <p className="font-display text-5xl md:text-6xl text-white mb-8 tracking-wide">
                  {getFieldValue(data.groomName)} & {getFieldValue(data.brideName)}
                </p>

                <div
                  className="h-px max-w-[80px] mx-auto mb-6"
                  style={{ background: 'var(--el-accent-soft)', opacity: 0.35 }}
                />

                <p className="text-petal-400 text-xs font-sans uppercase tracking-[0.2em]">
                  <InlineSlotEditor slotKey="footerCredit" label="Bản quyền / Credit" value={data.footerCredit}>
                    {getFieldValue(data.footerCredit)}
                  </InlineSlotEditor>
                </p>
              </div>
            </footer>
          </main>
        </Envelope>
      </TemplateDataProvider>
    </ThemeRoot>
  );
}
