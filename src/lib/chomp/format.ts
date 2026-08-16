import type { TimerState } from "./types";

/** MM:SS, always two digits, always tabular in the type. */
export function formatClock(totalSec: number): string {
  const safe = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function pad2(n: number): string {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

const ORDINALS = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];

function countWord(n: number): string {
  return ORDINALS[n - 1] ?? String(n);
}

/**
 * Plain-language praise built from real data. It never scolds, never mentions
 * an abandoned session, and never implies a debt — see the no-guilt clause in
 * PRODUCT_BRIEF.
 */
export function praiseLine(state: TimerState): string {
  const { sessionsToday, sessionTarget, streakDays, lifetimeSessions } = state;

  if (lifetimeSessions === 1) {
    return "First one down. That's the hard part over.";
  }
  if (sessionsToday >= sessionTarget) {
    return `That's ${countWord(sessionsToday)} today — the whole target, gone.`;
  }
  if (sessionsToday >= 2 && streakDays >= 3) {
    return `That's ${countWord(sessionsToday)} today, ${streakDays} days running.`;
  }
  if (sessionsToday >= 2) {
    return `That's ${countWord(sessionsToday)} today. Nice pile.`;
  }
  if (streakDays >= 2) {
    return `On the board again — day ${streakDays}.`;
  }
  return "One down. Everything after this is a bonus.";
}

/** e.g. "04 TODAY · 11 DAY STREAK" */
export function summaryLine(state: TimerState): string {
  return `${pad2(state.sessionsToday)} TODAY · ${state.streakDays} DAY STREAK`;
}
