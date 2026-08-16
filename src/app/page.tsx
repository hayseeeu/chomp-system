import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Chomp — 25 minutes. No guilt. Go.",
};

const MARQUEE_TEXT =
  "No streaks · No shame · No confetti · No settings rabbit hole";
// One copy of the track needs to be wider than any real viewport, or the
// -50% loop shows a blank stretch of the acid band before it repeats. 12
// repeats of the full phrase comfortably clears ultrawide monitors.
const MARQUEE_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: `marquee-item-${i}`,
  text: `${MARQUEE_TEXT} ✳`,
}));

const FEATURES = [
  {
    n: "01",
    title: "One button",
    body: "No settings rabbit hole. Pick a length, hit the slab, you're running.",
  },
  {
    n: "02",
    title: "The room goes quiet",
    body: "Once the clock runs, the interface strips to a number and one moving bar.",
  },
  {
    n: "03",
    title: "Quit free",
    body: "Kill a session and nothing is logged, counted or held against you.",
  },
] as const;

/**
 * Marketing landing — the loud shell that sells the app before it hands you
 * off to the calm core at /timer. See PRODUCT_BRIEF.md's "loud shell, calm
 * core": this page is allowed to be a poster; /timer is not.
 */
export default function Home() {
  return (
    <>
      <SiteHeader cta />

      <main>
        {/* ---- hero ------------------------------------------------------- */}
        <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-6 pt-16 pb-14 sm:px-10 lg:grid-cols-[1fr_440px] lg:pt-20 lg:pb-16">
          <div>
            <p className="mb-6 font-mono text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Pomodoro for brains that stall at the start line
            </p>
            <h1 className="-ml-[0.05em] font-display text-[clamp(56px,10vw,132px)] leading-[0.82] tracking-[-0.06em] text-foreground uppercase">
              25 minutes.
              <br />
              No guilt.
              <br />
              <span className="text-primary">Go.</span>
            </h1>
            <p className="mt-8 max-w-[520px] text-lg leading-[1.5] font-medium text-foreground text-pretty">
              One button, one number, nothing to fiddle with. The screen goes
              dead quiet the second you start, and quitting early costs you
              exactly nothing.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-7">
              <Button
                variant="default"
                nativeButton={false}
                render={<Link href="/timer" />}
                className="min-h-[76px] px-14 py-[22px] font-display text-[28px] tracking-[-0.02em] shadow-[7px_7px_0_0_var(--secondary)] hover:shadow-[10px_10px_0_0_var(--secondary)]"
              >
                Chomp it
              </Button>
              <Link
                href="/timer"
                className="border-b-2 border-primary pb-1 font-sans text-[13px] font-extrabold tracking-[0.1em] text-foreground uppercase transition-colors duration-90 ease-out hover:text-primary"
              >
                See the quiet screen →
              </Link>
            </div>
          </div>

          <div className="flex h-[280px] items-center justify-center lg:h-[440px]">
            {/** biome-ignore lint/performance/noImgElement: static site asset */}
            <img
              src="/chomp-logo.svg"
              alt="Chomp mark"
              className="size-[260px] lg:size-[380px]"
            />
          </div>
        </section>

        {/* ---- marquee ------------------------------------------------------ */}
        {/* Two identical copies of a track that's already wider than the
            viewport, translated by exactly -50%: the seam where copy 1 ends
            and copy 2 begins is never visible, so the loop reads as
            continuous instead of resetting on a blank yellow gap. */}
        <div className="overflow-hidden border-y-2 border-foreground bg-primary py-3.5">
          <div className="flex w-max animate-[chomp-marquee_36s_linear_infinite]">
            {[0, 1].map((track) => (
              <div key={track} className="flex" aria-hidden={track === 1}>
                {MARQUEE_ITEMS.map((item) => (
                  <span
                    key={item.id}
                    className="px-[22px] font-mono text-[13px] font-bold tracking-[0.18em] text-primary-foreground uppercase"
                  >
                    {item.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ---- features ------------------------------------------------------ */}
        <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-6 py-16 sm:px-10 md:grid-cols-3 lg:py-20">
          {FEATURES.map((f) => (
            <div
              key={f.n}
              className="border-2 border-foreground bg-card px-7 py-8 shadow-[5px_5px_0_0_var(--primary)]"
            >
              <p className="mb-5 font-mono text-[11px] font-bold tracking-[0.14em] text-primary">
                {f.n}
              </p>
              <h3 className="mb-3 text-[32px] leading-[1.05] font-extrabold tracking-[-0.02em] text-foreground">
                {f.title}
              </h3>
              <p className="text-base leading-[1.5] font-medium text-foreground text-pretty">
                {f.body}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-6 border-t-2 border-foreground px-6 py-7 sm:px-10">
        <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Free · no account · no tracking
        </span>
        <a
          href="mailto:carandancal@gmail.com"
          className="font-mono text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase hover:text-primary"
        >
          carandancal@gmail.com
        </a>
      </footer>
    </>
  );
}
