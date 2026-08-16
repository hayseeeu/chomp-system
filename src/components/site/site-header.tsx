import Link from "next/link";
import { ChompMark } from "@/components/site/chomp-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  active?: "timer" | "about";
  /** The landing page gets a CTA slab in the nav; interior pages don't. */
  cta?: boolean;
}

/**
 * The exact row dimensions (padding, border) every page's top bar uses —
 * the marketing nav here and the timer's idle-state header in
 * idle-screen.tsx both import this so the header never resizes between
 * pages.
 */
export const SITE_HEADER_ROW_CLASS =
  "flex flex-wrap items-center justify-between gap-6 border-b-2 border-foreground px-6 py-5 sm:px-10";

/**
 * Nav chrome for the marketing site — landing and about pages only. The
 * timer itself stays chrome-free by design (see PRODUCT_BRIEF's "loud
 * shell, calm core"), so this never appears on /timer.
 */
export function SiteHeader({ active, cta = false }: SiteHeaderProps) {
  return (
    <header className={SITE_HEADER_ROW_CLASS}>
      <ChompMark />

      <nav className="flex items-center gap-8">
        <Link
          href="/timer"
          className={cn(
            "font-sans text-[13px] font-bold tracking-[0.04em] uppercase transition-colors duration-90 ease-out",
            active === "timer"
              ? "border-b-2 border-primary pb-0.5 text-primary"
              : "text-foreground hover:text-primary",
          )}
        >
          Timer
        </Link>
        <Link
          href="/about"
          className={cn(
            "font-sans text-[13px] font-bold tracking-[0.04em] uppercase transition-colors duration-90 ease-out",
            active === "about"
              ? "border-b-2 border-primary pb-0.5 text-primary"
              : "text-foreground hover:text-primary",
          )}
        >
          About
        </Link>
        {cta && (
          <Button
            variant="default"
            size="sm"
            nativeButton={false}
            render={<Link href="/timer" />}
          >
            Start a chomp
          </Button>
        )}
      </nav>
    </header>
  );
}
