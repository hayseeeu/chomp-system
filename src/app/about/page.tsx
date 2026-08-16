import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About — Chomp",
};

const GITHUB_REPO_URL = "https://github.com/hayseeeu/chomp-system";
const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;

const FACTS: {
  label: string;
  value: string;
  accent?: boolean;
}[] = [
  { label: "Price", value: "Free, actually", accent: true },
  { label: "Accounts", value: "None. Ever." },
  { label: "Data leaving your device", value: "Zero bytes" },
];

const EMAIL = "carandancal@gmail.com";

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
                  <span
                    className={
                      fact.accent
                        ? "font-display text-[28px] tracking-[-0.03em] text-primary uppercase"
                        : "text-xl font-extrabold text-foreground"
                    }
                  >
                    {fact.value}
                  </span>
                </div>
              ))}

              {/* A button instead of the raw repo URL as text — the real
                  path is long enough to wrap awkwardly on phone no matter
                  how it's sized. */}
              <div className="flex flex-col gap-2.5">
                <div className="-mt-[9px] mb-[9px] h-0.5 bg-border/30" />
                <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Source
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={
                    // biome-ignore lint/a11y/useAnchorContent: Button supplies the accessible content as children through this render prop.
                    <a
                      href={GITHUB_REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  className="w-fit"
                >
                  View on GitHub ↗
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
          <div className="h-0.5 bg-foreground" />
        </div>

        {/* ---- contact ----------------------------------------------------- */}
        <section
          id="contact"
          className="mx-auto grid max-w-[1440px] grid-cols-1 gap-14 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_560px] lg:py-16"
        >
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
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center justify-between gap-5 border-2 border-foreground px-6 py-[22px] text-foreground shadow-[5px_5px_0_0_var(--primary)] transition-[transform,box-shadow] duration-90 ease-out hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[8px_8px_0_0_var(--primary)]"
            >
              <span className="flex min-w-0 flex-col gap-[7px]">
                <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Email — best for anything
                </span>
                {/* text-base keeps the real address on one line at 390px —
                    the design's 30px display size only fits from sm: up. */}
                <span className="font-display text-base tracking-[-0.03em] text-primary sm:text-[30px]">
                  {EMAIL}
                </span>
              </span>
              <span className="shrink-0 font-display text-2xl text-foreground">
                ↗
              </span>
            </a>

            {/* A button instead of the raw issues URL as text — same reason
                as the Source fact above. */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-foreground px-6 py-5 text-foreground">
              <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Bugs and feature requests
              </span>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={
                  // biome-ignore lint/a11y/useAnchorContent: Button supplies the accessible content as children through this render prop.
                  <a
                    href={GITHUB_ISSUES_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Open an issue ↗
              </Button>
            </div>

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
