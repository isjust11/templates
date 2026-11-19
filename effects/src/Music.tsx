'use client';

import { useCallback, useRef, useState } from 'react';

export function useInviteMusic(enabled: boolean, url: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);

  const start = useCallback(() => {
    if (!enabled || audioRef.current) return;
    const audio = new Audio(url || '/music/song.mp3');
    audio.loop = true;
    audio.play().catch(() => {});
    audioRef.current = audio;
  }, [enabled, url]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setMuted(audioRef.current.muted);
  }, []);

  return { start, toggleMute, muted };
}
