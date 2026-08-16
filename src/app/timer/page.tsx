"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BreakScreen } from "@/components/chomp/break-screen";
import { CustomPresetDialog } from "@/components/chomp/custom-preset-dialog";
import { DoneScreen } from "@/components/chomp/done-screen";
import { FocusScreen } from "@/components/chomp/focus-screen";
import { IdleScreen } from "@/components/chomp/idle-screen";
import { SetupDialog } from "@/components/chomp/setup-dialog";
import { Toaster, toast } from "@/components/ui/toast";
import { useAmbientSound } from "@/hooks/use-ambient-sound";
import { playSting, useNotifications } from "@/hooks/use-notifications";
import { useTimer } from "@/hooks/use-timer";
import { praiseLine, summaryLine } from "@/lib/chomp/format";
import { AMBIENT_TRACKS, PRESETS } from "@/lib/chomp/types";

/**
 * All four screens are states of one machine at `/timer`, not four routes.
 */
export default function Home() {
  const router = useRouter();
  const timer = useTimer();
  const { state, hydrated } = timer;
  const { requestPermission, notify } = useNotifications();

  const [setupOpen, setSetupOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const dialogOpen = setupOpen || customOpen;

  useAmbientSound(state.sound.track, state.sound.volume, state.sound.playing);

  const activeTask = state.tasks.find((t) => t.id === state.activeTaskId);
  const trackLabel =
    AMBIENT_TRACKS.find((t) => t.id === state.sound.track)?.label ?? "Silence";

  // ---- end-of-run side effects --------------------------------------------
  const { onSessionEnd, onBreakEnd } = timer;

  useEffect(() => {
    onSessionEnd(() => {
      playSting();
      notify("That's a chomp", `${state.preset.focus} minutes, gone.`);
    });
  }, [onSessionEnd, notify, state.preset.focus]);

  useEffect(() => {
    onBreakEnd(() => {
      notify("Break's up", "Back in 10 · or not, whatever.");
      // Acid, never riot: a break ending is not an error.
      toast.add({
        title: "Break's up",
        description: "Back in 10 · or not, whatever",
      });
    });
  }, [onBreakEnd, notify]);

  // ---- start ---------------------------------------------------------------
  const start = useCallback(() => {
    // Permission is asked for lazily, on the FIRST start — never on page load.
    void requestPermission();
    timer.start();
  }, [requestPermission, timer]);

  // ---- keyboard ------------------------------------------------------------
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing) return;

      if (e.key === " " || e.code === "Space") {
        if (dialogOpen) return;
        e.preventDefault();
        if (state.phase === "idle") start();
        else if (state.phase === "focus") timer.togglePause();
        return;
      }

      if (e.key === "Escape") {
        // Let the dialog take Escape first; only a running session is killed.
        if (dialogOpen) return;
        if (state.phase === "focus") {
          timer.kill();
          return;
        }
        // From idle — where the back-to-home mark lives — Escape does the
        // same thing clicking it does.
        if (state.phase === "idle") router.push("/");
        return;
      }

      if (e.key.toLowerCase() === "t" && state.phase === "idle") {
        e.preventDefault();
        setSetupOpen(true);
        return;
      }

      if (state.phase === "idle" && !dialogOpen && /^[123]$/.test(e.key)) {
        const preset = PRESETS[Number(e.key) - 1];
        if (preset) timer.selectPreset(preset.focus, preset.break);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.phase, dialogOpen, start, timer, router]);

  // Nothing renders until localStorage has been read, so a session in flight
  // isn't flashed as IDLE for a frame on refresh.
  if (!hydrated) {
    return <div className="min-h-svh bg-background" />;
  }

  return (
    <>
      {state.phase === "focus" && (
        <FocusScreen
          taskName={activeTask?.title ?? "No task"}
          sessionIndex={Math.min(state.sessionsToday + 1, state.sessionTarget)}
          sessionTarget={state.sessionTarget}
          remainingSec={state.remainingSec}
          progress={timer.progress}
          soundLabel={
            state.sound.track === "none"
              ? "Silence"
              : `${trackLabel} · ${state.sound.volume}%`
          }
          isPaused={state.isPaused}
          onKill={timer.kill}
          onTogglePause={timer.togglePause}
        />
      )}

      {state.phase === "idle" && (
        <IdleScreen
          summary={summaryLine(state)}
          taskTitle={activeTask?.title ?? null}
          preset={state.preset}
          onSelectPreset={timer.selectPreset}
          onOpenCustom={() => setCustomOpen(true)}
          onOpenTasks={() => setSetupOpen(true)}
          onStart={start}
        />
      )}

      {state.phase === "done" && (
        <DoneScreen
          focusMinutes={state.preset.focus}
          lifetimeSessions={state.lifetimeSessions}
          sessionsToday={state.sessionsToday}
          sessionTarget={state.sessionTarget}
          praise={praiseLine(state)}
          onTakeBreak={timer.takeBreak}
        />
      )}

      {state.phase === "break" && (
        <BreakScreen
          remainingSec={state.remainingSec}
          onSkip={timer.skipBreak}
          onExtend={timer.extendBreak}
        />
      )}

      <SetupDialog
        open={setupOpen}
        onOpenChange={setSetupOpen}
        tasks={state.tasks}
        activeTaskId={state.activeTaskId}
        track={state.sound.track}
        volume={state.sound.volume}
        onSelectTask={timer.selectTask}
        onAddTask={timer.addTask}
        onToggleTask={timer.toggleTask}
        onDeleteTask={timer.deleteTask}
        onSetTrack={timer.setTrack}
        onSetVolume={timer.setVolume}
      />

      <CustomPresetDialog
        open={customOpen}
        onOpenChange={setCustomOpen}
        preset={state.preset}
        onApply={timer.selectPreset}
      />

      <Toaster />
    </>
  );
}
