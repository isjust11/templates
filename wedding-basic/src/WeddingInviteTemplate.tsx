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
  return (
    <ThemeRoot data={data}>
      <TemplateDataProvider
        data={data}
        isEditing={isEditing}
        onFieldChange={onFieldChange}
        onUploadImage={onUploadImage}
      >
        <Envelope
          brideName={getFieldValue(data.brideName) || ''}
          groomName={getFieldValue(data.groomName) || ''}
          coverImage={data.coverImage}
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
