"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CustomPresetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preset: { focus: number; break: number };
  onApply: (focus: number, breakMin: number) => void;
}

const FOCUS_RANGE = [5, 180] as const;
const BREAK_RANGE = [1, 60] as const;

export function CustomPresetDialog({
  open,
  onOpenChange,
  preset,
  onApply,
}: CustomPresetDialogProps) {
  const [focus, setFocus] = useState(String(preset.focus));
  const [brk, setBrk] = useState(String(preset.break));

  useEffect(() => {
    if (open) {
      setFocus(String(preset.focus));
      setBrk(String(preset.break));
    }
  }, [open, preset.focus, preset.break]);

  const focusNum = Number(focus);
  const brkNum = Number(brk);
  const focusError =
    !Number.isInteger(focusNum) ||
    focusNum < FOCUS_RANGE[0] ||
    focusNum > FOCUS_RANGE[1]
      ? `Between ${FOCUS_RANGE[0]} and ${FOCUS_RANGE[1]} minutes`
      : null;
  const brkError =
    !Number.isInteger(brkNum) ||
    brkNum < BREAK_RANGE[0] ||
    brkNum > BREAK_RANGE[1]
      ? `Between ${BREAK_RANGE[0]} and ${BREAK_RANGE[1]} minutes`
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Custom</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="focus-min" className="type-label text-foreground">
              Focus minutes
            </label>
            <Input
              id="focus-min"
              inputMode="numeric"
              value={focus}
              aria-invalid={focusError !== null}
              aria-describedby={focusError ? "focus-min-error" : undefined}
              onChange={(e) => setFocus(e.target.value)}
            />
            {/* Errors are never colour alone — the message is always present. */}
            {focusError && (
              <p id="focus-min-error" className="type-mono-xs text-secondary">
                {focusError}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="break-min" className="type-label text-foreground">
              Break minutes
            </label>
            <Input
              id="break-min"
              inputMode="numeric"
              value={brk}
              aria-invalid={brkError !== null}
              aria-describedby={brkError ? "break-min-error" : undefined}
              onChange={(e) => setBrk(e.target.value)}
            />
            {brkError && (
              <p id="break-min-error" className="type-mono-xs text-secondary">
                {brkError}
              </p>
            )}
          </div>
        </div>

        <div className="mt-2 flex gap-4">
          <Button
            disabled={focusError !== null || brkError !== null}
            onClick={() => {
              onApply(focusNum, brkNum);
              onOpenChange(false);
            }}
          >
            Use it
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Never mind
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
