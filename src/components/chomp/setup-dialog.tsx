"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { AMBIENT_TRACKS, type Task } from "@/lib/chomp/types";
import { cn } from "@/lib/utils";

interface SetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
  activeTaskId: string | null;
  track: string;
  volume: number;
  onSelectTask: (id: string | null) => void;
  onAddTask: (title: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSetTrack: (track: string) => void;
  onSetVolume: (volume: number) => void;
}

/**
 * Everything that isn't "start a session" lives behind this one dialog, which
 * is why IDLE has no settings on it. It groups the task list with the ambient
 * sound controls exactly as the component gallery does.
 */
export function SetupDialog({
  open,
  onOpenChange,
  tasks,
  activeTaskId,
  track,
  volume,
  onSelectTask,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onSetTrack,
  onSetVolume,
}: SetupDialogProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const submit = () => {
    if (!draft.trim()) return;
    onAddTask(draft);
    setDraft("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-[520px]"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>
            What are you
            <br />
            chomping?
          </DialogTitle>
          <DialogDescription>
            Pick one. You can change your mind mid-session and nothing bad
            happens.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3">
          <Input
            ref={inputRef}
            value={draft}
            placeholder="Rewrite the onboarding copy"
            aria-label="New task"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
          />
          <Button onClick={submit} disabled={!draft.trim()}>
            Add
          </Button>
        </div>

        {tasks.length > 0 && (
          <ul className="flex flex-col border-2 border-foreground">
            {tasks.map((task, i) => {
              const active = task.id === activeTaskId;
              return (
                <li
                  key={task.id}
                  className={cn(
                    "flex items-center gap-4 p-[16px_18px]",
                    i < tasks.length - 1 && "border-b-2",
                    // The active task is a full acid flood, not a subtle tint:
                    // "which one am I on" must be answerable from across a room.
                    active
                      ? "border-b-foreground bg-primary text-primary-foreground"
                      : "border-b-foreground/25",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    aria-label={
                      task.done
                        ? `Mark "${task.title}" as not done`
                        : `Mark "${task.title}" as done`
                    }
                    aria-pressed={task.done}
                    className={cn(
                      "relative flex size-[22px] shrink-0 items-center justify-center border-2 font-sans text-sm font-black outline-none after:absolute after:-inset-[13px] after:content-[''] focus-visible:shadow-[4px_4px_0_0_var(--ring)]",
                      active
                        ? "border-primary-foreground"
                        : "border-foreground",
                      task.done && !active && "border-primary bg-primary",
                    )}
                  >
                    {task.done && (
                      <span
                        aria-hidden="true"
                        className="text-primary-foreground"
                      >
                        ✕
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTask(task.id)}
                    className={cn(
                      "flex-1 text-left font-sans text-base outline-none focus-visible:underline",
                      active ? "font-bold" : "font-medium",
                      task.done && "text-muted-foreground line-through",
                    )}
                  >
                    {task.title}
                    {active && <span className="sr-only"> (selected)</span>}
                  </button>

                  <span
                    className={cn(
                      "font-mono text-xs tabular-nums",
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {task.sessions > 0 ? `${task.sessions} ×` : "—"}
                  </span>

                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    aria-label={`Delete "${task.title}"`}
                    className="relative font-mono text-xs uppercase outline-none after:absolute after:-inset-3 after:content-[''] hover:underline focus-visible:underline"
                  >
                    Del
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <fieldset className="flex flex-col gap-3 border-0 p-0">
          <legend className="type-label mb-2 text-foreground">
            Ambient sound
          </legend>
          <div className="flex flex-wrap gap-[10px]">
            {AMBIENT_TRACKS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={t.id === track}
                onClick={() => onSetTrack(t.id)}
                className={cn(
                  "relative border-2 px-[14px] py-2 font-mono text-[13px] font-bold outline-none after:absolute after:inset-x-0 after:-inset-y-[6px] after:content-[''] focus-visible:shadow-[4px_4px_0_0_var(--ring)]",
                  t.id === track
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-foreground/35 text-foreground hover:border-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-2 flex justify-between font-mono text-xs tracking-[1px] text-muted-foreground uppercase">
            <span id="volume-label">Volume</span>
            <span className="text-accent-text tabular-nums">{volume}%</span>
          </div>
          <Slider
            aria-labelledby="volume-label"
            value={volume}
            min={0}
            max={100}
            onValueChange={(v) =>
              onSetVolume(Array.isArray(v) ? (v[0] ?? 0) : v)
            }
          />
        </fieldset>

        <div className="mt-2 flex gap-4">
          <Button onClick={() => onOpenChange(false)}>Done</Button>
          {activeTaskId && (
            <Button variant="outline" onClick={() => onSelectTask(null)}>
              Clear pick
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
