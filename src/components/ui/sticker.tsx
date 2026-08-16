"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Sticker — not a shadcn part, CHOMP-only.
 *
 * REWARD ONLY. Stickers appear on session completion and never carry
 * information the user can't get somewhere else. On mount they "slam":
 * scale 1.4 -> 1 over 140ms ease-out with the rotation held throughout.
 * `prefers-reduced-motion` kills the slam (handled globally in globals.css).
 *
 * The two-part shadow is the one place blur is permitted in this system.
 */
function Sticker({
  className,
  size = 124,
  rotate,
  children,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  /** 104–130px per the spec. */
  size?: number
  /** Degrees. Omit to get a stable pseudo-random angle between -14 and +14. */
  rotate?: number
}) {
  // Chosen once per mount so the sticker doesn't re-roll on every render, and
  // resolved in an effect so server and client markup agree.
  const [angle, setAngle] = React.useState(rotate ?? -12)

  React.useEffect(() => {
    if (rotate !== undefined) {
      setAngle(rotate)
      return
    }
    setAngle(Math.round((Math.random() * 28 - 14) * 10) / 10)
  }, [rotate])

  const offset = Math.round(size * 0.089) // 11px at 124px

  return (
    <div
      data-slot="sticker"
      className={cn(
        "flex shrink-0 animate-[chomp-slam_140ms_ease-out] items-center justify-center rounded-full bg-secondary text-center font-sans text-[13px] leading-[1.2] font-extrabold tracking-[0.26px] text-secondary-foreground uppercase",
        className
      )}
      style={
        {
          width: size,
          height: size,
          "--sticker-rotate": `${angle}deg`,
          transform: `rotate(${angle}deg)`,
          boxShadow: `0 ${offset}px 0 0 var(--background), 0 ${offset}px ${offset * 2}px 0 rgba(0,0,0,0.35)`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  )
}

export { Sticker }
