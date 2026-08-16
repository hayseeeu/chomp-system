"use client";

import { formatClock } from "@/lib/chomp/format";

interface FocusScreenProps {
  taskName: string;
  sessionIndex: number;
  sessionTarget: number;
  remainingSec: number;
  /** 0..1 */
  progress: number;
  soundLabel: string;
  isPaused: boolean;
  onKill: () => void;
  onTogglePause: () => void;
}

/**
 * FOCUS — the calm core, and the most important screen in the app.
 *
 * This is deliberately its own component rather than a shared layout with the
 * chrome conditionally hidden: it is far too easy to leak a logo, a stat or a
 * nav item in that way, and the whole point of this screen is that there is
 * nothing here. No logo, no navigation, no stats, no task list, no settings,
 * and no colour anywhere except the progress bar.
 */
export function FocusScreen({
  taskName,
  sessionIndex,
  sessionTarget,
  remainingSec,
  progress,
  soundLabel,
  isPaused,
  onKill,
  onTogglePause,
}: FocusScreenProps) {
  const clock = formatClock(remainingSec);
  const minutesLeft = Math.ceil(remainingSec / 60);

  return (
    <main className="flex min-h-svh flex-col bg-background px-5 py-8 sm:px-6 sm:py-10 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs tracking-[2px] text-muted-foreground uppercase">
          {taskName}
        </p>
        <p className="font-mono text-xs tracking-[2px] text-muted-foreground tabular-nums">
          {sessionIndex} / {sessionTarget}
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        {/* Space pauses. The countdown itself is also the pause target so
            touch users get parity without adding a control to a screen whose
            whole job is having none. */}
        <button
          type="button"
          onClick={onTogglePause}
          aria-label={isPaused ? "Resume session" : "Pause session"}
          className="type-timer text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <span aria-hidden="true">{clock}</span>
        </button>
        {/* Announced at minute boundaries only — polite, and never once a
            second, which would talk over a screen reader continuously. */}
        <p className="sr-only" aria-live="polite">
          {isPaused
            ? `Paused, ${minutesLeft} minutes left`
            : `${minutesLeft} minutes left`}
        </p>
        {/* Pause is stated in words, never by colour or by the absence of
            motion alone. */}
        {isPaused && (
          <p className="type-mono-xs text-foreground">
            Paused · space to resume
          </p>
        )}
      </div>

      {/* The only moving element on the screen, and that is the point.
          Hard-edged, acid, linear. See PRODUCT_BRIEF. */}
      <div
        className="relative mb-[14px] h-[14px] bg-foreground/12"
        aria-hidden="true"
      >
        <div
          className="absolute inset-y-0 left-0 bg-primary transition-[width] duration-1000 ease-linear"
          style={{ width: `${(progress * 100).toFixed(3)}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs tracking-[1.5px] text-muted-foreground uppercase">
          {soundLabel}
        </p>
        {/* Ends the session immediately. No confirmation dialog, nothing
            logged, nothing counted. The no-guilt clause is a product rule —
            the "Kill this session?" dialog in the reference document is a
            specimen of the dialog component, not part of this flow. */}
        <button
          type="button"
          onClick={onKill}
          className="min-h-12 border-b-2 border-foreground/30 font-sans text-[13px] font-extrabold tracking-[1px] text-muted-foreground uppercase transition-colors duration-90 ease-out hover:border-secondary hover:text-secondary focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none"
        >
          Kill it
        </button>
      </div>
    </main>
  );
}
