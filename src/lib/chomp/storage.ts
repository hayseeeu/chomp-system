import { initialState } from "./reducer";
import type { TimerState } from "./types";

const KEY = "chomp:v1";

export function loadState(): TimerState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<TimerState>;
    // Merge over the defaults so a state written by an older build still
    // hydrates rather than crashing on a missing field.
    return {
      ...initialState,
      ...parsed,
      preset: { ...initialState.preset, ...parsed.preset },
      sound: { ...initialState.sound, ...parsed.sound },
      tasks: parsed.tasks ?? [],
    };
  } catch {
    return null;
  }
}

export function saveState(state: TimerState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode, quota, whatever. Losing persistence is not worth a crash.
  }
}
