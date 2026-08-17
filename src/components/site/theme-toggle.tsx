"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * IDLE and marketing chrome only — never FOCUS, which stays chromeless.
 * Labels the mode you'd GET, not the mode you're in ("Light mode" while
 * dark). Never icon-only.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoids a hydration mismatch: resolvedTheme is undefined until next-themes
  // reads localStorage/system preference on mount. Before that, assume dark
  // to match the <html> fallback class in layout.tsx.
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : true;
  const nextLabel = isDark ? "Light mode" : "Dark mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center gap-2 border-2 border-foreground bg-transparent px-3 transition-[transform,box-shadow] duration-90 ease-out outline-none hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--primary)] active:translate-x-0 active:translate-y-0 active:shadow-none focus-visible:shadow-[4px_4px_0_0_var(--ring)]",
        className,
      )}
    >
      <span aria-hidden="true" className="size-[11px] shrink-0 bg-primary" />
      <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-foreground uppercase">
        {nextLabel}
      </span>
    </button>
  );
}
