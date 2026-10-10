'use client';

import { useState } from 'react';
import Album from './Album';
import { Atmosphere, AutoScroll } from './Atmosphere';
import Countdown from './Countdown';
import Details from './Details';
import Envelope from './Envelope';
import { linesOf, textOf } from './fields';
import Footer from './Footer';
import Hero from './Hero';
import Navigation from './Navigation';
import Rsvp from './Rsvp';
import Schedule from './Schedule';
import ThemeRoot from './ThemeRoot';
import Welcome from './Welcome';
import { readInviteEffects } from './theme';

export default function ModernTemplate({
  data,
  eventSlug,
  isEditing = false,
}: {
  data: Record<string, unknown>;
  eventSlug?: string;
  isEditing?: boolean;
  onFieldChange?: (fieldKey: string, value: unknown) => void;
  onUploadImage?: (file: File) => Promise<string>;
}) {
  const effects = readInviteEffects(data);
  const [opened, setOpened] = useState(false);
  const brideName = textOf(data.brideName);
  const groomName = textOf(data.groomName);
  const coverImage = textOf(data.coverImage);
  const backgroundImage = textOf(data.backgroundImage);
  const highlight = Number(textOf(data.welcomeHighlightLineIndex) || data.welcomeHighlightLineIndex || 0);

  return (
    <ThemeRoot data={data}>
      <Atmosphere enabled={effects.petals} />
      <AutoScroll enabled={effects.autoScroll && opened && !isEditing} speed={effects.autoScrollSpeed} />
      <Envelope
        brideName={brideName}
        groomName={groomName}
        coverImage={coverImage}
        data={data}
        onOpened={() => setOpened(true)}
      >
        <Navigation />
        <main>
          <Hero
            brideName={brideName}
            groomName={groomName}
            dateLabel={textOf(data.eventDateDisplay)}
            city={textOf(data.city)}
            coverImage={coverImage}
            backgroundImage={backgroundImage}
          />
          <Welcome lines={linesOf(data.welcomeLines)} highlightIndex={Number.isFinite(highlight) ? highlight : 0} />
          <Countdown targetDate={textOf(data.eventDate)} />
          <Schedule intro={textOf(data.scheduleIntro)} schedule={data.schedule} />
          <Details
            venue={textOf(data.venue)}
            city={textOf(data.city)}
            hosts={textOf(data.hosts)}
            note={textOf(data.eventNote)}
            mapsUrl={textOf(data.mapsUrl)}
          />
          <Album album={data.album} />
          <Rsvp eventSlug={eventSlug} />
          <Footer
            message={textOf(data.footerMessage)}
            credit={textOf(data.footerCredit)}
            groomName={groomName}
            brideName={brideName}
          />
        </main>
      </Envelope>
    </ThemeRoot>
  );
}
