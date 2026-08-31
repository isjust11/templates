'use client';

import Hero from './Hero';
import WelcomeMessage from './WelcomeMessage';
import Countdown from './Countdown';
import WeddingDay from './WeddingDay';
import EventDetails from './EventDetails';
import RsvpForm from './RsvpForm';
import Envelope from './Envelope';
import Navigation from './Navigation';
import { TemplateDataProvider } from './TemplateDataProvider';
import InlineSlotEditor from './InlineSlotEditor';
import type { TemplateEventData } from './types';

/** Complete single-page template; all visible content comes from typed slot data. */
export default function WeddingInviteTemplate({
  data,
  isEditing = false,
  onFieldChange,
  onUploadImage,
}: {
  data: TemplateEventData;
  isEditing?: boolean;
  onFieldChange?: (fieldKey: keyof TemplateEventData, value: unknown) => void;
  onUploadImage?: (file: File) => Promise<string>;
}) {
  return (
    <TemplateDataProvider
      data={data}
      isEditing={isEditing}
      onFieldChange={onFieldChange}
      onUploadImage={onUploadImage}
    >
      <Envelope brideName={data.brideName} groomName={data.groomName}>
        <Navigation />
        <main className="min-h-screen">
          <Hero />

          <WelcomeMessage />

          <section id="countdown" className="py-24 px-4 bg-cream-50">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="font-display text-5xl md:text-7xl text-sage-800 mb-6">
                {data.locale.startsWith('vi')
                  ? 'Đếm ngược ngày cưới'
                  : 'Той күніне дейін'}
              </h2>
              <div className="w-20 h-px bg-sage-300 mx-auto" />
            </div>
            <Countdown targetDate={data.eventDate} />
          </section>

          <WeddingDay />
          <EventDetails />
          <RsvpForm />

          <footer className="bg-sage-800 py-16 text-center">
            <div className="max-w-4xl mx-auto px-4">
              <p className="text-cream-200 text-lg mb-4 font-serif">
                <InlineSlotEditor slotKey="footerMessage" label="Lời cảm ơn chân trang" value={data.footerMessage}>
                  {data.footerMessage}
                </InlineSlotEditor>
              </p>
              <p className="text-cream-50 font-display text-4xl md:text-5xl mb-8">
                {data.groomName} & {data.brideName}
              </p>
              <div className="w-16 h-px bg-sage-500 mx-auto mb-6" />
              <p className="text-sage-400 text-sm font-sans">
                <InlineSlotEditor slotKey="footerCredit" label="Bản quyền / Credit" value={data.footerCredit}>
                  {data.footerCredit}
                </InlineSlotEditor>
              </p>
            </div>
          </footer>
        </main>
      </Envelope>
    </TemplateDataProvider>
  );
}
