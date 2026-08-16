"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { initialState, isoDate, timerReducer } from "@/lib/chomp/reducer";
import { loadState, saveState } from "@/lib/chomp/storage";
import type { TimerState } from "@/lib/chomp/types";

/** DONE auto-advances to BREAK after this long if nobody touches it. */
export const DONE_AUTO_ADVANCE_MS = 10_000;

export interface UseTimer {
  state: TimerState;
  hydrated: boolean;
  /** 0..1 elapsed fraction of the current run. */
  progress: number;
  start: () => void;
  togglePause: () => void;
  kill: () => void;
  takeBreak: () => void;
  skipBreak: () => void;
  extendBreak: () => void;
  selectPreset: (focus: number, breakMin: number) => void;
  selectTask: (taskId: string | null) => void;
  addTask: (title: string) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  setTrack: (track: string) => void;
  setVolume: (volume: number) => void;
  onSessionEnd: (fn: () => void) => void;
  onBreakEnd: (fn: () => void) => void;
}

export function useTimer(): UseTimer {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  const sessionEndRef = useRef<(() => void) | null>(null);
  const breakEndRef = useRef<(() => void) | null>(null);

  // ---- hydrate from localStorage ------------------------------------------
  useEffect(() => {
    const stored = loadState();
    const now = Date.now();
    if (stored) dispatch({ type: "HYDRATE", state: stored, now });
    dispatch({ type: "ROLL_DAY", date: isoDate() });
    setHydrated(true);
  }, []);

  // ---- persist -------------------------------------------------------------
  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  // ---- tick ----------------------------------------------------------------
  // remainingSec is always derived from the absolute endsAt, so a throttled or
  // suspended background tab can stall the interval without the clock drifting.
  const running =
    (state.phase === "focus" || state.phase === "break") &&
    !state.isPaused &&
    state.endsAt !== null;

  useEffect(() => {
    if (!running) return;

    const tick = () => dispatch({ type: "TICK", now: Date.now() });
    tick();
    const id = window.setInterval(tick, 1000);

    // Recompute the moment the tab comes back rather than waiting a second.
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", tick);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", tick);
    };
  }, [running]);

  // ---- run completion ------------------------------------------------------
  useEffect(() => {
    if (!hydrated || state.remainingSec > 0 || state.endsAt === null) return;

    if (state.phase === "focus") {
      dispatch({ type: "COMPLETE", date: isoDate() });
      sessionEndRef.current?.();
    } else if (state.phase === "break") {
      dispatch({ type: "BREAK_DONE" });
      breakEndRef.current?.();
    }
  }, [hydrated, state.remainingSec, state.endsAt, state.phase]);

  // ---- DONE auto-advance ---------------------------------------------------
  useEffect(() => {
    if (state.phase !== "done") return;
    const id = window.setTimeout(
      () => dispatch({ type: "TAKE_BREAK", now: Date.now() }),
      DONE_AUTO_ADVANCE_MS,
    );
    return () => window.clearTimeout(id);
  }, [state.phase]);

  // ---- day rollover --------------------------------------------------------
  useEffect(() => {
    const id = window.setInterval(
      () => dispatch({ type: "ROLL_DAY", date: isoDate() }),
      60_000,
    );
    return () => window.clearInterval(id);
  }, []);

  // Pause/resume needs the freshest isPaused without re-creating the callback.
  const stateRef = useRef(state);
  stateRef.current = state;

  const start = useCallback(() => {
    dispatch({ type: "START", now: Date.now() });
  }, []);

  const togglePause = useCallback(() => {
    dispatch({
      type: stateRef.current.isPaused ? "RESUME" : "PAUSE",
      now: Date.now(),
    });
  }, []);

  const elapsed = state.durationSec - state.remainingSec;
  const progress =
    state.durationSec > 0
      ? Math.min(1, Math.max(0, elapsed / state.durationSec))
      : 0;

  return {
    state,
    hydrated,
    progress,
    start,
    togglePause,
    kill: useCallback(() => dispatch({ type: "KILL" }), []),
    takeBreak: useCallback(
      () => dispatch({ type: "TAKE_BREAK", now: Date.now() }),
      [],
    ),
    skipBreak: useCallback(() => dispatch({ type: "SKIP_BREAK" }), []),
    extendBreak: useCallback(
      () => dispatch({ type: "EXTEND_BREAK", now: Date.now() }),
      [],
    ),
    selectPreset: useCallback(
      (focus: number, breakMin: number) =>
        dispatch({ type: "SELECT_PRESET", focus, break: breakMin }),
      [],
    ),
    selectTask: useCallback(
      (taskId: string | null) => dispatch({ type: "SELECT_TASK", taskId }),
      [],
    ),
    addTask: useCallback((title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      dispatch({ type: "ADD_TASK", title: trimmed, id: crypto.randomUUID() });
    }, []),
    toggleTask: useCallback(
      (taskId: string) => dispatch({ type: "TOGGLE_TASK", taskId }),
      [],
    ),
    deleteTask: useCallback(
      (taskId: string) => dispatch({ type: "DELETE_TASK", taskId }),
      [],
    ),
    setTrack: useCallback(
      (track: string) => dispatch({ type: "SET_TRACK", track }),
      [],
    ),
    setVolume: useCallback(
      (volume: number) => dispatch({ type: "SET_VOLUME", volume }),
      [],
    ),
    onSessionEnd: useCallback((fn: () => void) => {
      sessionEndRef.current = fn;
    }, []),
    onBreakEnd: useCallback((fn: () => void) => {
      breakEndRef.current = fn;
    }, []),
  };
}
