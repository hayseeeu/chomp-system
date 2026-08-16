"use client";

import { useEffect, useRef } from "react";
import { AMBIENT_TRACKS } from "@/lib/chomp/types";

/**
 * Looping ambient bed driven by the reducer's `sound` slice.
 *
 * The audio loops themselves are NOT part of the design handoff — drop
 * brown-noise.mp3, rain.mp3 and cafe.mp3 into /public/audio to light this up.
 * Until they exist the element fails to load and the app carries on silently;
 * the status line and the volume control still work.
 */
export function useAmbientSound(
  trackId: string,
  volume: number,
  playing: boolean,
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioRef.current ?? new Audio();
    audioRef.current = el;
    el.loop = true;
    el.preload = "none";

    const src = AMBIENT_TRACKS.find((t) => t.id === trackId)?.src ?? null;
    const nextSrc = src ? new URL(src, window.location.origin).href : "";

    if (el.src !== nextSrc) {
      el.pause();
      if (nextSrc) el.src = nextSrc;
      else el.removeAttribute("src");
    }

    el.volume = Math.min(1, Math.max(0, volume / 100));

    if (playing && nextSrc) {
      // play() rejects under autoplay policy until the user has interacted;
      // by the time a session starts they have, but never let it throw.
      void el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  }, [trackId, volume, playing]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);
}
