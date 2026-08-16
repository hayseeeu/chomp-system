"use client";

import { Sticker } from "@/components/ui/sticker";

interface DoneScreenProps {
  focusMinutes: number;
  lifetimeSessions: number;
  sessionsToday: number;
  sessionTarget: number;
  praise: string;
  onTakeBreak: () => void;
}

/**
 * DONE — the payoff, and the biggest moment in the app, because it is the
 * moment that has to make someone come back. A full acid flood with a rotated
 * sticker slapped over it.
 *
 * The colour flood survives `prefers-reduced-motion`: it is a state change,
 * not decoration. Only the sticker's slam is suppressed.
 */
export function DoneScreen({
  focusMinutes,
  lifetimeSessions,
  sessionsToday,
  sessionTarget,
  praise,
  onTakeBreak,
}: DoneScreenProps) {
  // One square per session in the target, filled for the ones already done.
  const dots = Array.from(
    { length: Math.max(sessionTarget, sessionsToday) },
    (_, i) => ({ id: `dot-${i}`, filled: i < sessionsToday }),
  );

  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-primary px-5 py-8 text-primary-foreground sm:px-6 sm:py-10 lg:p-8">
      <Sticker
        size={124}
        rotate={-12}
        className="absolute top-[26px] right-[26px] z-10"
        aria-hidden="true"
      >
        Chomp
        <br />#{lifetimeSessions}
      </Sticker>

      <p className="max-w-[calc(100%-160px)] font-mono text-xs tracking-[2px] text-primary-foreground/70 uppercase">
        {focusMinutes} minutes · gone
      </p>

      <h1 className="-ml-[0.06em] mt-[10px] font-display text-[clamp(80px,13vw,160px)] leading-[0.82] tracking-[-0.06em] text-primary-foreground uppercase">
        Done
      </h1>

      {/* Generated from real data. Never scolds, never mentions an abandoned
          session, never implies a debt. */}
      <p className="mt-[14px] max-w-[340px] font-sans text-xl leading-[1.3] font-bold text-primary-foreground">
        {praise}
      </p>

      <div
        className="mt-[18px] flex flex-wrap gap-[6px]"
        role="img"
        aria-label={`${sessionsToday} of ${sessionTarget} sessions done today`}
      >
        {dots.map((dot) => (
          <span
            key={dot.id}
            className={
              dot.filled
                ? "size-[22px] bg-primary-foreground"
                : "size-[22px] border-2 border-primary-foreground/30"
            }
          />
        ))}
      </div>

      <div className="mt-auto pt-10">
        <button
          type="button"
          onClick={onTakeBreak}
          className="w-full border-2 border-transparent bg-primary-foreground p-5 font-display text-2xl tracking-[-0.02em] text-primary uppercase shadow-[7px_7px_0_0_var(--secondary)] transition-[transform,box-shadow] duration-90 ease-out outline-none hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[10px_10px_0_0_var(--secondary)] focus-visible:border-secondary active:translate-x-[7px] active:translate-y-[7px] active:shadow-none"
        >
          Take the break
        </button>
      </div>
    </main>
  );
}
