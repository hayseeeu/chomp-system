"use client";

import { ChompMark } from "@/components/site/chomp-mark";
import { SITE_HEADER_ROW_CLASS } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import { PRESETS } from "@/lib/chomp/types";
import { cn } from "@/lib/utils";

interface IdleScreenProps {
  summary: string;
  taskTitle: string | null;
  preset: { focus: number; break: number };
  onSelectPreset: (focus: number, breakMin: number) => void;
  onOpenCustom: () => void;
  onOpenTasks: () => void;
  onStart: () => void;
}

/**
 * IDLE — the loudest screen in the app.
 *
 * Its only job is to overcome the activation energy of starting, so it behaves
 * like a poster rather than a control panel: one enormous word, a slab button
 * the width of the screen, and no settings in sight.
 */
export function IdleScreen({
  summary,
  taskTitle,
  preset,
  onSelectPreset,
  onOpenCustom,
  onOpenTasks,
  onStart,
}: IdleScreenProps) {
  const isCustom = !PRESETS.some(
    (p) => p.focus === preset.focus && p.break === preset.break,
  );

  return (
    <div className="flex min-h-svh flex-col">
      <header className={SITE_HEADER_ROW_CLASS}>
        <ChompMark />
        <p className="font-mono text-xs tracking-[1px] text-muted-foreground uppercase tabular-nums">
          {summary}
        </p>
      </header>

      <main className="flex flex-1 flex-col px-5 py-8 pb-[calc(112px_+_env(safe-area-inset-bottom))] sm:px-6 sm:py-10 sm:pb-10 lg:p-8">
        {/* -0.05em pulls the glyph edge back so it optically aligns with the
          container rather than sitting inside its own side bearing. */}
        <h1 className="-ml-[0.05em] mt-[22px] font-display text-[clamp(72px,11vw,140px)] leading-[0.85] tracking-[-0.05em] text-primary uppercase">
          Ready
        </h1>

        <div className="mt-[18px] flex flex-wrap gap-[10px]">
          {PRESETS.map((p, i) => {
            const active = p.focus === preset.focus && p.break === preset.break;
            return (
              <button
                key={p.label}
                type="button"
                aria-pressed={active}
                onClick={() => onSelectPreset(p.focus, p.break)}
                // The ::after extends the hit target to 48px without inflating
                // the chip past the spec'd 8px/14px padding.
                className={cn(
                  "relative px-[14px] py-2 font-mono text-[13px] font-bold transition-colors duration-90 ease-out outline-none after:absolute after:inset-x-0 after:-inset-y-[6px] after:content-[''] focus-visible:border-ring focus-visible:shadow-[4px_4px_0_0_var(--ring)]",
                  active
                    ? "border-2 border-primary bg-primary text-primary-foreground"
                    : "border-2 border-foreground/35 bg-transparent text-foreground hover:border-foreground",
                )}
              >
                {p.label}
                <span className="sr-only"> — shortcut {i + 1}</span>
              </button>
            );
          })}
          <button
            type="button"
            aria-pressed={isCustom}
            onClick={onOpenCustom}
            className={cn(
              "relative px-[14px] py-2 font-mono text-[13px] font-bold transition-colors duration-90 ease-out outline-none after:absolute after:inset-x-0 after:-inset-y-[6px] after:content-[''] focus-visible:border-ring focus-visible:shadow-[4px_4px_0_0_var(--ring)]",
              isCustom
                ? "border-2 border-primary bg-primary text-primary-foreground"
                : "border-2 border-foreground/35 border-dashed bg-transparent text-foreground hover:border-foreground",
            )}
          >
            {isCustom ? `${preset.focus} / ${preset.break}` : "Custom"}
          </button>
        </div>

        <div className="mt-auto pt-10">
          <button
            type="button"
            onClick={onOpenTasks}
            className="mb-[18px] flex min-h-12 w-full items-center gap-[14px] border-2 border-foreground p-[14px_16px] text-left transition-[box-shadow] duration-90 ease-out outline-none focus-visible:border-ring focus-visible:shadow-[4px_4px_0_0_var(--ring)]"
          >
            <span
              aria-hidden="true"
              className="size-5 shrink-0 border-2 border-foreground"
            />
            <span className="flex-1 font-sans text-base font-semibold text-foreground">
              {taskTitle ?? "Nothing picked yet"}
            </span>
            <span className="font-mono text-xs text-muted-foreground uppercase">
              Change
            </span>
          </button>

          {/* Fixed to the bottom under 640px so the one thing that matters is
            always in thumb reach. */}
          <div className="fixed inset-x-5 bottom-[max(20px,env(safe-area-inset-bottom))] z-10 sm:static sm:inset-auto">
            <Button variant="slam" size="slam" onClick={onStart}>
              Chomp it
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
