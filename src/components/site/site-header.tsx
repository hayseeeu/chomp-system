"use client";

import Link from "next/link";
import { useState } from "react";
import { ChompMark } from "@/components/site/chomp-mark";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
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

const NAV_LINKS = [
  { key: "timer", href: "/timer", label: "Timer" },
  { key: "about", href: "/about", label: "About" },
] as const;

/**
 * Nav chrome for the marketing site — landing and about pages only. The
 * timer itself stays chrome-free by design (see PRODUCT_BRIEF's "loud
 * shell, calm core"), so this never appears on /timer.
 *
 * Below 640px the link row has nowhere to go next to the mark and the CTA,
 * so it collapses to a hamburger that opens a full-bleed acid menu sheet
 * (spec A4). From 640px up the links return inline, same as desktop (spec
 * B1/B2 — "nav links return").
 */
export function SiteHeader({ active, cta = false }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className={SITE_HEADER_ROW_CLASS}>
      <ChompMark />

      <nav className="hidden items-center gap-8 sm:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            className={cn(
              "font-sans text-[13px] font-bold tracking-[0.04em] uppercase transition-colors duration-90 ease-out",
              active === link.key
                ? "border-b-2 border-primary pb-0.5 text-accent-text"
                : "text-foreground hover:text-accent-text",
            )}
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
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

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <button
              type="button"
              aria-label="Open menu"
              className="-mr-3 flex size-12 shrink-0 flex-col items-end justify-center gap-1.5 bg-transparent outline-none sm:hidden"
            />
          }
        >
          <span
            aria-hidden="true"
            className="h-[2.5px] w-[26px] bg-foreground"
          />
          <span
            aria-hidden="true"
            className="h-[2.5px] w-[26px] bg-foreground"
          />
          <span aria-hidden="true" className="h-[2.5px] w-4 bg-primary" />
        </SheetTrigger>

        {/* Full-bleed acid sheet — spec A4. Ink text/borders come from
            --primary-foreground, which is ink in both palettes, so this
            reads correctly regardless of the app's (currently fixed) dark
            mode. Never rendered at sm and up. */}
        <SheetContent
          side="right"
          showCloseButton={false}
          className="inset-y-0 right-0 h-svh w-full max-w-none border-0 bg-primary p-0 text-primary-foreground shadow-none data-[side=right]:w-full data-[side=right]:max-w-none data-[side=right]:border-l-0 sm:hidden"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b-2 border-primary-foreground px-6 py-5">
              <span className="font-display text-[19px] tracking-[-0.03em] uppercase">
                Chomp<span className="text-secondary">*</span>
              </span>
              <SheetClose
                render={
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="-mr-3 flex size-12 items-center justify-end font-display text-[26px] outline-none transition-colors duration-90 ease-out hover:text-secondary"
                  />
                }
              >
                ✕
              </SheetClose>
            </div>

            <nav className="flex flex-col px-6 pt-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[76px] items-center border-b-2 border-primary-foreground font-display text-[46px] leading-none tracking-[-0.04em] uppercase transition-colors duration-90 ease-out hover:text-secondary"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/about#contact"
                onClick={() => setOpen(false)}
                className="flex min-h-[76px] items-center border-b-2 border-primary-foreground font-display text-[46px] leading-none tracking-[-0.04em] uppercase transition-colors duration-90 ease-out hover:text-secondary"
              >
                Contact
              </Link>
            </nav>

            <div className="mt-auto flex flex-col gap-4 px-6 pb-6">
              <ThemeToggle className="border-primary-foreground [&_span:last-child]:text-primary-foreground" />
              <span className="font-mono text-[11px] font-semibold tracking-[0.12em] uppercase opacity-65">
                Free · no account · no tracking
                <br />
                carandancal@gmail.com
              </span>
              <Button
                variant="default"
                nativeButton={false}
                render={<Link href="/timer" onClick={() => setOpen(false)} />}
                className="min-h-[68px] bg-background text-accent-text shadow-[6px_6px_0_0_var(--secondary)] hover:text-accent-text"
              >
                Chomp it
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
