export type Phase = "idle" | "focus" | "break" | "done";

export interface Task {
  id: string;
  title: string;
  done: boolean;
  /** Completed sessions spent on this task. Abandoned ones are never counted. */
  sessions: number;
}

export interface Preset {
  label: string;
  focus: number;
  break: number;
}

export interface AmbientTrack {
  id: string;
  label: string;
  /** Public path to a looping audio file, or null for "Nothing at all". */
  src: string | null;
}

export interface TimerState {
  phase: Phase;
  /** From the active preset, in seconds. */
  durationSec: number;
  remainingSec: number;
  isPaused: boolean;
  /**
   * Absolute epoch ms the current run ends at, or null when paused/idle.
   * remainingSec is derived from this on every tick so the countdown cannot
   * drift or stall in a background tab.
   */
  endsAt: number | null;
  activeTaskId: string | null;
  tasks: Task[];
  sessionsToday: number;
  /** Drives the dot row on DONE. */
  sessionTarget: number;
  /** The sticker number. */
  lifetimeSessions: number;
  streakDays: number;
  bestStreak: number;
  /** ISO date (YYYY-MM-DD) of the last completed session. */
  lastSessionDate: string | null;
  /** ISO date the sessionsToday counter belongs to. */
  today: string | null;
  preset: { focus: number; break: number };
  sound: { track: string; volume: number; playing: boolean };
}

export type TimerAction =
  | { type: "HYDRATE"; state: TimerState; now: number }
  | { type: "ROLL_DAY"; date: string }
  | { type: "SELECT_PRESET"; focus: number; break: number }
  | { type: "SELECT_TASK"; taskId: string | null }
  | { type: "ADD_TASK"; title: string; id: string }
  | { type: "TOGGLE_TASK"; taskId: string }
  | { type: "DELETE_TASK"; taskId: string }
  | { type: "START"; now: number }
  | { type: "PAUSE"; now: number }
  | { type: "RESUME"; now: number }
  | { type: "TICK"; now: number }
  | { type: "KILL" }
  | { type: "COMPLETE"; date: string }
  | { type: "TAKE_BREAK"; now: number }
  | { type: "SKIP_BREAK" }
  | { type: "EXTEND_BREAK"; now: number }
  | { type: "BREAK_DONE" }
  | { type: "SET_TRACK"; track: string }
  | { type: "SET_VOLUME"; volume: number }
  | { type: "TOGGLE_SOUND" };

export const PRESETS: Preset[] = [
  { label: "25 / 5", focus: 25, break: 5 },
  { label: "50 / 10", focus: 50, break: 10 },
  { label: "15 / 3", focus: 15, break: 3 },
];

export const AMBIENT_TRACKS: AmbientTrack[] = [
  { id: "brown", label: "Brown noise", src: "/audio/brown-noise.mp3" },
  { id: "rain", label: "Rain on a tin roof", src: "/audio/rain.mp3" },
  { id: "cafe", label: "Café, badly recorded", src: "/audio/cafe.mp3" },
  { id: "none", label: "Nothing at all", src: null },
];
