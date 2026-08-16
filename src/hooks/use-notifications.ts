"use client";

import { useCallback, useRef } from "react";

/**
 * Browser notifications, requested lazily on the FIRST session start — never
 * on page load. Copy stays casual: an app that looks like a punk flyer gets to
 * be relaxed about failure, and that casualness is the therapeutic part.
 */
export function useNotifications() {
  const asked = useRef(false);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (asked.current || Notification.permission !== "default") return;
    asked.current = true;
    try {
      await Notification.requestPermission();
    } catch {
      // Denied or unsupported. The app works fine without it.
    }
  }, []);

  const notify = useCallback((title: string, body: string) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    try {
      new Notification(title, { body, tag: "chomp", silent: false });
    } catch {
      // Some browsers throw for non-persistent notifications. Not worth a crash.
    }
  }, []);

  return { requestPermission, notify };
}

/**
 * A short sting on completion. Synthesised rather than loaded — the design has
 * no assets, and a two-note blip does not deserve a network request.
 */
export function playSting(): void {
  if (typeof window === "undefined") return;
  const Ctx = window.AudioContext ?? window.webkitAudioContext;
  if (!Ctx) return;

  try {
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    for (const [freq, at] of [
      [660, 0],
      [990, 0.11],
    ] as const) {
      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, now + at);
      osc.connect(gain);
      osc.start(now + at);
      osc.stop(now + at + 0.16);
    }

    window.setTimeout(() => ctx.close(), 800);
  } catch {
    // Autoplay policy or no audio device. Silence is an acceptable outcome.
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
