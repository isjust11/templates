'use client';

import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AutoScroll, useConfettiPlayer, useInviteMusic } from '@eventlab/effects';
import { ModernProvider, useLowPower, type ModernContextValue } from './context';
import { dictFor, parseEventDate, resolveLocale, text, type ModernEventData } from './fields';
import {
  WEDDING_MODERN_FONTS_HREF,
  readInviteEffects,
  readStoredThemeCss,
  resolveThemeTokens,
  themeToCssVars,
} from './theme';
import { MODERN_CSS } from './styles';
import Gate from './Gate';
import Hero from './Hero';
import Marquee from './Marquee';
import Invitation from './Invitation';
import Couple from './Couple';
import Countdown from './Countdown';
import Story from './Story';
import Events from './Events';
import Gallery from './Gallery';
import DressCode from './DressCode';
import Gifts from './Gifts';
import Rsvp from './Rsvp';
import Footer from './Footer';

/** Personalised link: `/invite/:slug?to=Anh%20Tuấn` greets the guest by name. */
function useGuestName(): string {
  const [name, setName] = useState('');
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('to') || '';
    setName(raw.trim().slice(0, 80));
  }, []);
  return name;
}

/** Thin accent line across the top that fills as the guest reads down the page. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <motion.div className="elm-progress" style={{ scaleX }} aria-hidden="true" />;
}

function MusicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round" />
    </svg>
  );
}

/** Editorial single-page invite; every visible string comes from slot data or the locale dictionary. */
export default function ModernTemplate({
  data: raw,
  eventSlug,
  isEditing = false,
}: {
  data: ModernEventData | Record<string, unknown>;
  eventSlug?: string;
  isEditing?: boolean;
}) {
  const data = raw as ModernEventData;
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

  const ctx = useMemo<ModernContextValue>(() => {
    const { lang, intl } = resolveLocale(data.locale);
    return {
      data,
      t: dictFor(lang),
      lang,
      intlLocale: intl,
      eventDate: parseEventDate(data.eventDate),
      groom: text(data.groomName),
      bride: text(data.brideName),
      eventSlug,
      revealed: opened,
      lowPower,
    };
  }, [data, eventSlug, opened, lowPower]);

  // Music must start inside the tap; the rest waits for the envelope animation to finish.
  const begin = useCallback(() => {
    music.start();
    setMusicStarted(effects.musicEnabled);
  }, [music, effects.musicEnabled]);

  const finish = useCallback(() => {
    setOpened(true);
    window.setTimeout(playConfetti, 500);
  }, [playConfetti]);

  const onMusicClick = () => {
    if (!musicStarted) {
      music.start();
      setMusicStarted(true);
    } else {
      music.toggleMute();
    }
  };

  return (
    <ModernProvider value={ctx}>
      <MotionConfig reducedMotion="user">
        <div
          className="el-invite-root elm"
          data-el-theme="1"
          lang={ctx.lang}
          style={themeToCssVars(tokens)}
        >
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href={WEDDING_MODERN_FONTS_HREF} precedence="default" />
          <style dangerouslySetInnerHTML={{ __html: MODERN_CSS }} />
          {storedCss ? <style dangerouslySetInnerHTML={{ __html: storedCss }} /> : null}

          <AnimatePresence>
            {!opened ? (
              <Gate
                key="gate"
                guestName={guestName}
                sparkles={effects.sparkles && !lowPower}
                onBegin={begin}
                onDone={finish}
              />
            ) : null}
          </AnimatePresence>

          {opened ? <ScrollProgress /> : null}

          <AutoScroll enabled={effects.autoScroll && opened && !isEditing} speed={effects.autoScrollSpeed} />

          <main>
            <Hero />
            <Marquee />
            <Invitation guestName={guestName} />
            <Couple />
            <Countdown />
            <Story />
            <Events />
            <Gallery />
            <DressCode />
            <Gifts />
            <Rsvp guestName={guestName} />
          </main>
          <Footer />

          {effects.musicEnabled && opened ? (
            <button
              type="button"
              className="elm-music"
              aria-label={ctx.t.music}
              aria-pressed={!musicStarted || music.muted}
              onClick={onMusicClick}
            >
              <MusicIcon />
            </button>
          ) : null}

          <div className="elm-grain" aria-hidden="true" />
        </div>
      </MotionConfig>
    </ModernProvider>
  );
}
