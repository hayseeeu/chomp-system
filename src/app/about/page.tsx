import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";

export const metadata: Metadata = {
  title: "About — Chomp",
};

const FACTS: {
  label: string;
  value: string;
  accent?: boolean;
  href?: string;
}[] = [
  { label: "Price", value: "Free, actually", accent: true },
  { label: "Accounts", value: "None. Ever." },
  { label: "Data leaving your device", value: "Zero bytes" },
  {
    label: "Source",
    value: "github.com/hayseeeu/chomp-system",
    href: "https://github.com/hayseeeu/chomp-system",
  },
];

const CONTACT_LINKS: {
  label: string;
  value: string;
  href: string;
  emphasis?: boolean;
}[] = [
  {
    label: "Email — best for anything",
    value: "carandancal@gmail.com",
    href: "mailto:carandancal@gmail.com",
    emphasis: true,
  },
  {
    label: "Bugs and feature requests",
    value: "github.com/hayseeeu/chomp-system/issues",
    href: "https://github.com/hayseeeu/chomp-system/issues",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader active="about" />

      <main>
        {/* ---- why this exists ------------------------------------------- */}
        <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-14 px-6 pt-16 pb-14 sm:px-10 lg:grid-cols-[1fr_560px] lg:pt-20 lg:pb-14">
          <div>
            <h1 className="-ml-[0.04em] font-display text-[clamp(44px,8vw,88px)] leading-[0.9] tracking-[-0.04em] text-foreground uppercase">
              Why this
              <br />
              <span className="text-secondary">exists</span>
            </h1>
            <div className="mt-9 flex max-w-[620px] flex-col gap-5">
              <p className="text-lg leading-[1.55] font-medium text-foreground text-pretty">
                Every timer I tried treated starting as the easy part. For a
                brain that stalls at the starting line, it's the only part. So
                this one is a poster before you start and a blank wall after —
                loud enough to shove you in, then completely out of the way.
              </p>
              <p className="text-lg leading-[1.55] font-medium text-muted-foreground text-pretty">
                There are no streaks to break, no confetti, no productivity
                score, no weekly report telling you how you did. Killing a
                session logs nothing. Coming back after eleven days looks
                exactly like coming back after one.
              </p>
              <p className="text-lg leading-[1.55] font-medium text-muted-foreground text-pretty">
                Built by one person who needed it, in the open, for free.
              </p>
            </div>
          </div>

          <div className="h-fit border-2 border-foreground px-[26px] py-7 shadow-[5px_5px_0_0_var(--secondary)]">
            <div className="flex flex-col gap-[22px]">
              {FACTS.map((fact, i) => (
                <div key={fact.label} className="flex flex-col gap-1.5">
                  {i > 0 && (
                    <div className="-mt-[9px] mb-[9px] h-0.5 bg-border/30" />
                  )}
                  <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    {fact.label}
                  </span>
                  {fact.href ? (
                    <a
                      href={fact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-extrabold text-primary hover:text-secondary"
                    >
                      {fact.value}
                    </a>
                  ) : (
                    <span
                      className={
                        fact.accent
                          ? "font-display text-[28px] tracking-[-0.03em] text-primary uppercase"
                          : "text-xl font-extrabold text-foreground"
                      }
                    >
                      {fact.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
          <div className="h-0.5 bg-foreground" />
        </div>

        {/* ---- contact ----------------------------------------------------- */}
        <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-14 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_560px] lg:py-16">
          <div>
            <h2 className="-ml-[0.04em] font-display text-[clamp(40px,6vw,72px)] leading-[0.9] tracking-[-0.04em] text-primary uppercase">
              Say
              <br />
              something
            </h2>
            <p className="mt-7 max-w-[420px] text-lg leading-[1.5] font-medium text-muted-foreground text-pretty">
              No contact form — just an inbox. Bug, feature, or a rant about
              productivity apps, it all goes to the same place and I read every
              one of them.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {CONTACT_LINKS.map((link) => (
              <a
                key={link.value}
                href={link.href}
                {...(link.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={
                  link.emphasis
                    ? "flex items-center justify-between gap-5 border-2 border-foreground px-6 py-[22px] text-foreground shadow-[5px_5px_0_0_var(--primary)] transition-[transform,box-shadow] duration-90 ease-out hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[8px_8px_0_0_var(--primary)]"
                    : "flex items-center justify-between gap-5 border-2 border-foreground px-6 py-5 text-foreground transition-[transform,box-shadow] duration-90 ease-out hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[6px_6px_0_0_var(--secondary)]"
                }
              >
                <span className="flex flex-col gap-[7px]">
                  <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    {link.label}
                  </span>
                  <span
                    className={
                      link.emphasis
                        ? "font-display text-[30px] tracking-[-0.03em] text-primary"
                        : "text-xl font-extrabold text-foreground"
                    }
                  >
                    {link.value}
                  </span>
                </span>
                <span className="font-display text-2xl text-foreground">↗</span>
              </a>
            ))}

            <div className="flex items-center gap-3 bg-card px-5 py-4">
              <span className="size-2.5 shrink-0 bg-primary" />
              <span className="font-mono text-xs font-semibold tracking-[0.08em] text-foreground uppercase">
                Usually answered within 2 days · Mon–Fri, GMT+8
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-6 border-t-2 border-foreground px-6 py-7 sm:px-10">
        <div className="flex items-center gap-2.5">
          {/** biome-ignore lint/performance/noImgElement: static site asset */}
          <img src="/chomp-logo.svg" alt="" className="size-6" />
          <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Chomp — 2026
          </span>
        </div>
        <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          No cookies. Nothing to accept.
        </span>
      </footer>
    </>
  );
}
