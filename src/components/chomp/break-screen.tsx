"use client";

import { formatClock } from "@/lib/chomp/format";

interface BreakScreenProps {
  remainingSec: number;
  onSkip: () => void;
  onExtend: () => void;
}

/**
 * BREAK — loud again, in pink.
 *
 * Permission to stop has to be as emphatic as permission to start, which is
 * why this screen gets the full riot flood. Cream on riot is 3.2:1 and is
 * allowed here ONLY on the display-size headline; every control on this
 * surface takes ink.
 */
export function BreakScreen({
  remainingSec,
  onSkip,
  onExtend,
}: BreakScreenProps) {
  const minutesLeft = Math.ceil(remainingSec / 60);

  return (
    <main className="flex min-h-svh flex-col overflow-hidden bg-secondary px-5 py-8 text-secondary-foreground sm:px-6 sm:py-10 lg:p-8">
      <p className="font-mono text-xs tracking-[2px] text-secondary-foreground uppercase">
        Go outside · look at something far away
      </p>

      {/* The one place cream-on-riot is permitted: display size only. */}
      <h1 className="-ml-[0.05em] mt-[10px] font-display text-[clamp(72px,12vw,148px)] leading-[0.85] text-foreground uppercase tracking-[-0.05em]">
        Break
      </h1>

      <p
        className="mt-[6px] font-mono text-[clamp(56px,9vw,104px)] leading-none font-bold tracking-[-0.03em] text-secondary-foreground tabular-nums"
        aria-hidden="true"
      >
        {formatClock(remainingSec)}
      </p>
      <p className="sr-only" aria-live="polite">
        {minutesLeft} minutes of break left
      </p>

      <div className="mt-auto flex flex-wrap gap-[14px] pt-10">
        <button
          type="button"
          onClick={onSkip}
          className="min-h-12 border-2 border-transparent bg-background px-[26px] py-4 font-sans text-sm font-extrabold tracking-[0.8px] text-foreground uppercase shadow-[5px_5px_0_0_var(--primary)] transition-[transform,box-shadow] duration-90 ease-out outline-none hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[8px_8px_0_0_var(--primary)] focus-visible:border-primary active:translate-x-[5px] active:translate-y-[5px] active:shadow-none"
        >
          Skip break
        </button>
        {/* Ink border, not cream — 14px on riot needs ink. */}
        <button
          type="button"
          onClick={onExtend}
          className="min-h-12 border-2 border-secondary-foreground bg-transparent px-[26px] py-4 font-sans text-sm font-extrabold tracking-[0.8px] text-secondary-foreground uppercase transition-[transform,box-shadow] duration-90 ease-out outline-none hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[8px_8px_0_0_var(--foreground)] focus-visible:shadow-[4px_4px_0_0_var(--foreground)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
        >
          +5 more
        </button>
      </div>
    </main>
  );
}
