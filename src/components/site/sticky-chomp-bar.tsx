"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Phone-only (spec A1): "Sticky bar pins to the bottom of the viewport once
 * the hero CTA scrolls out." Render this immediately after the hero's
 * "Chomp it" button — once that button scrolls above the fold, this bar
 * takes over so the one thing that matters is always in thumb reach.
 */
export function StickyChompBar() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" />
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-20 border-t-2 border-foreground bg-background px-5 pt-3 pb-[max(10px,env(safe-area-inset-bottom))] transition-transform duration-150 ease-out sm:hidden",
          visible ? "translate-y-0" : "pointer-events-none translate-y-full",
        )}
      >
        <Button
          variant="default"
          nativeButton={false}
          render={<Link href="/timer" />}
          className="min-h-14 w-full font-display text-xl"
          tabIndex={visible ? 0 : -1}
        >
          Chomp it
        </Button>
        <div className="flex justify-center pt-2.5">
          <div className="h-[5px] w-[134px] bg-foreground/20" />
        </div>
      </div>
    </>
  );
}
