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
import type { TemplateEventData } from './types';

/** Complete single-page template; all visible content comes from typed slot data. */
export default function WeddingInviteTemplate({
  data,
}: {
  data: TemplateEventData;
}) {
  return (
    <TemplateDataProvider data={data}>
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
                {data.footerMessage}
              </p>
              <p className="text-cream-50 font-display text-4xl md:text-5xl mb-8">
                {data.groomName} & {data.brideName}
              </p>
              <div className="w-16 h-px bg-sage-500 mx-auto mb-6" />
              <p className="text-sage-400 text-sm font-sans">
                {data.footerCredit}
              </p>
            </div>
          </footer>
        </main>
      </Envelope>
    </TemplateDataProvider>
  );
}
