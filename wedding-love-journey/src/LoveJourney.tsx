'use client';

import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AutoScroll, useConfettiPlayer, useInviteMusic } from '@eventlab/effects';
import { JourneyProvider, useLowPower, type JourneyContextValue } from './context';
import { dictFor, parseEventDate, resolveLocale, text, type LoveJourneyData } from './fields';
import { fontStylesheets, readInviteEffects, readStoredThemeCss, resolveThemeTokens, themeToCssVars } from './theme';
import { JOURNEY_CSS } from './styles';
import { BotanicalDefs } from './Botanicals';
import Cover from './Cover';
import Falling from './Falling';
import Hero from './Hero';
import Dear from './Dear';
import Couple from './Couple';
import Album from './Album';
import Movie from './Movie';
import Location from './Location';
import Gift from './Gift';
import Rsvp from './Rsvp';
import Footer from './Footer';
import Dock from './Dock';
import { WishSheet, WishTicker, useWishes } from './Wishes';

/** Personalised link: `/invite/:slug?to=Anh%20Tuấn` greets the guest by name. */
function useGuestName(): string {
  const [name, setName] = useState('');
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('to') || '';
    setName(raw.trim().slice(0, 80));
  }, []);
  return name;
}

function Overlay({
  guestName,
  music,
  playing,
  onToggleSound,
}: {
  guestName: string;
  music: boolean;
  playing: boolean;
  onToggleSound: () => void;
}) {
  const { wishes, add } = useWishes();
  const [wishOpen, setWishOpen] = useState(false);
  const closeWish = useCallback(() => setWishOpen(false), []);
  return (
    <>
      <WishTicker wishes={wishes} />
      <Dock music={music} playing={playing} onToggleSound={onToggleSound} onWish={() => setWishOpen(true)} />
      <WishSheet open={wishOpen} onClose={closeWish} onSent={add} guestName={guestName} />
    </>
  );
}

/** Sage botanical single-column invite; every visible string comes from slot data or the locale dictionary. */
export default function LoveJourney({
  data: raw,
  eventSlug,
  isEditing = false,
}: {
  data: LoveJourneyData | Record<string, unknown>;
  eventSlug?: string;
  isEditing?: boolean;
}) {
  const data = raw as LoveJourneyData;
  const record = raw as Record<string, unknown>;
  const tokens = useMemo(() => resolveThemeTokens(record), [record]);
  const effects = readInviteEffects(record);
  const storedCss = readStoredThemeCss(record);
  const guestName = useGuestName();
  const lowPower = useLowPower();

  const [opened, setOpened] = useState(!effects.gate || isEditing);
  const [musicStarted, setMusicStarted] = useState(false);
  const music = useInviteMusic(effects.musicEnabled, effects.musicUrl);
  const playConfetti = useConfettiPlayer(effects.confetti && !lowPower);

  const ctx = useMemo<JourneyContextValue>(() => {
    const { lang } = resolveLocale(data.locale);
    // The studio preview host stands in `preview` for the slug; nothing posts from there.
    const liveSlug = eventSlug && eventSlug !== 'preview' ? eventSlug : undefined;
    return {
      data,
      t: dictFor(lang),
      lang,
      eventDate: parseEventDate(data.eventDate),
      groom: text(data.groomName),
      bride: text(data.brideName),
      eventSlug: liveSlug,
      isEditing,
      lowPower,
    };
  }, [data, eventSlug, isEditing, lowPower]);

  const startMusic = useCallback(() => {
    if (!effects.musicEnabled) return;
    music.start();
    setMusicStarted(true);
  }, [music, effects.musicEnabled]);

  // Without the envelope there is no tap to hang music on, so the guest's first touch starts it.
  useEffect(() => {
    if (!opened || musicStarted || !effects.musicEnabled || isEditing) return;
    const onFirst = () => startMusic();
    window.addEventListener('pointerdown', onFirst, { once: true });
    return () => window.removeEventListener('pointerdown', onFirst);
  }, [opened, musicStarted, effects.musicEnabled, isEditing, startMusic]);

  const finish = useCallback(() => {
    setOpened(true);
    window.setTimeout(playConfetti, 250);
  }, [playConfetti]);

  const toggleSound = () => {
    if (!musicStarted) startMusic();
    else music.toggleMute();
  };

  const ambient = !lowPower && !isEditing && opened;

  return (
    <JourneyProvider value={ctx}>
      <MotionConfig reducedMotion="user">
        <div className="el-invite-root lj" data-el-theme="1" lang={ctx.lang} style={themeToCssVars(tokens)}>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          {fontStylesheets(tokens).map((href) => (
            <link key={href} rel="stylesheet" href={href} precedence="default" />
          ))}
          <style dangerouslySetInnerHTML={{ __html: JOURNEY_CSS }} />
          {storedCss ? <style dangerouslySetInnerHTML={{ __html: storedCss }} /> : null}
          <BotanicalDefs />

          <AnimatePresence>
            {!opened ? <Cover key="cover" guestName={guestName} onBegin={startMusic} onDone={finish} /> : null}
          </AnimatePresence>

          {ambient ? <Falling leaves={effects.petals} hearts={effects.hearts} /> : null}
          <AutoScroll enabled={effects.autoScroll && opened && !isEditing} speed={effects.autoScrollSpeed} />

          <div className="lj-column">
            <main>
              <Hero started={opened} />
              <Dear guestName={guestName} />
              <Couple />
              <Album />
              <Movie />
              <Location />
              <Gift />
              <Rsvp guestName={guestName} />
            </main>
            <Footer />
          </div>

          {opened ? (
            <Overlay
              guestName={guestName}
              music={effects.musicEnabled}
              playing={musicStarted && !music.muted}
              onToggleSound={toggleSound}
            />
          ) : null}
        </div>
      </MotionConfig>
    </JourneyProvider>
  );
}
