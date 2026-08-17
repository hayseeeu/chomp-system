"use client";

import { useEffect, useState } from "react";
import { BreakScreen } from "@/components/chomp/break-screen";
import { DoneScreen } from "@/components/chomp/done-screen";
import { FocusScreen } from "@/components/chomp/focus-screen";
import { IdleScreen } from "@/components/chomp/idle-screen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Sticker } from "@/components/ui/sticker";
import { Toaster, toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const noop = () => undefined;

function Section({
  n,
  title,
  aside,
  children,
}: {
  n: string;
  title: string;
  aside: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1440px] px-6 pt-16 lg:px-12 lg:pt-24">
      <div className="mb-12 flex flex-wrap items-baseline gap-5 border-b-[3px] border-foreground pb-5">
        <span className="font-mono text-sm font-bold tracking-[2px] text-accent-text">
          {n}
        </span>
        <h2 className="type-display-2 text-foreground">{title}</h2>
        <span className="ml-auto font-mono text-[13px] text-muted-foreground">
          {aside}
        </span>
      </div>
      {children}
    </section>
  );
}

function Cell({
  label,
  note,
  children,
  className,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-foreground/25 p-8", className)}>
      <div className="mb-5 font-mono text-xs font-bold tracking-[1.5px] text-accent-text uppercase">
        {label}
      </div>
      {children}
      {note && (
        <p className="mt-[22px] font-mono text-xs leading-[1.7] text-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}

function Swatch({
  name,
  hex,
  usage,
  className,
}: {
  name: string;
  hex: string;
  usage: string;
  className: string;
}) {
  return (
    <div className="border-2 border-foreground">
      <div className={cn("h-24", className)} />
      <div className="flex flex-col gap-1 border-t-2 border-foreground p-4">
        <span className="type-label text-foreground">{name}</span>
        <span className="font-mono text-xs text-muted-foreground">{hex}</span>
        <span className="font-mono text-xs text-muted-foreground">{usage}</span>
      </div>
    </div>
  );
}

/** A screen state rendered at frame size — the real component, not a mock. */
function Frame({
  label,
  note,
  children,
}: {
  label: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-[14px] flex flex-wrap items-baseline gap-3">
        <span className="font-mono text-xs font-bold tracking-[1.5px] text-accent-text uppercase">
          {label}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{note}</span>
      </div>
      <div className="h-[520px] overflow-hidden border-[3px] border-foreground [&_main]:h-full [&_main]:min-h-0">
        {children}
      </div>
    </div>
  );
}

export default function KitchenSink() {
  const [palette, setPalette] = useState<"hazard" | "solvent">("hazard");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [volume, setVolume] = useState(60);
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (palette === "solvent") root.dataset.palette = "solvent";
    else delete root.dataset.palette;
    return () => {
      delete root.dataset.palette;
    };
  }, [palette]);

  // ?palette=solvent and ?dialog=1 so the page can be driven by a headless
  // screenshot run without a click.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("palette") === "solvent") setPalette("solvent");
    if (params.get("dialog") === "1") setDialogOpen(true);
    if (params.get("toast") === "1") {
      toast.add({
        title: "Break's up",
        description: "Back in 10 · or not, whatever",
      });
    }
  }, []);

  return (
    <div className="bg-background pb-24">
      <header className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-6 px-6 pt-16 lg:px-12">
        <div>
          <p className="type-mono-xs text-muted-foreground">
            Verification page · not shipped to users
          </p>
          <h1 className="-ml-[0.06em] mt-3 type-display-2 text-accent-text">
            Kitchen sink
          </h1>
        </div>
        <div className="flex gap-3">
          {(["hazard", "solvent"] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={palette === p ? "default" : "outline"}
              onClick={() => setPalette(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      <Section
        n="01"
        title="Colour"
        aside="70 ink / 20 cream / 8 acid / 2 riot"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Swatch
            name="background"
            hex="#1A1A1A · ink"
            usage="the 70%"
            className="bg-background"
          />
          <Swatch
            name="foreground"
            hex="#FFF5E1 · cream"
            usage="text, borders"
            className="bg-foreground"
          />
          <Swatch
            name="primary"
            hex="#FFEA4D · acid"
            usage="progress, reward"
            className="bg-primary"
          />
          <Swatch
            name="secondary"
            hex="#FF3B6F · riot"
            usage="events only"
            className="bg-secondary"
          />
          <Swatch
            name="card"
            hex="#2C2A27 · soot"
            usage="muted surface"
            className="bg-card"
          />
          <Swatch
            name="muted-foreground"
            hex="#918C81 · solid tint"
            usage="never alpha"
            className="bg-muted-foreground"
          />
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="border-2 border-foreground bg-secondary p-6">
            <p className="type-label text-secondary-foreground">
              Ink on riot · 5.1:1 · default
            </p>
          </div>
          <div className="border-2 border-foreground bg-secondary p-6">
            <p className="font-display text-3xl text-foreground uppercase">
              Cream · display only
            </p>
          </div>
          <div className="border-2 border-foreground p-6">
            <p className="text-lg text-secondary">
              Riot on ink · 18px and up only
            </p>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section n="02" title="Type" aside="archivo black / archivo / jetbrains">
        <div className="flex flex-col gap-8">
          {[
            { id: "display-1", cls: "type-display-1", sample: "Chomp" },
            { id: "display-2", cls: "type-display-2", sample: "Ready" },
            { id: "timer", cls: "type-timer", sample: "14:02" },
            { id: "h3", cls: "type-h3", sample: "Kill this session?" },
            {
              id: "body-lg",
              cls: "type-body-lg",
              sample: "Nothing is logged, nothing is lost, nobody is told.",
            },
            { id: "nav", cls: "type-nav", sample: "Sessions" },
            {
              id: "label",
              cls: "type-label",
              sample: "What are you chomping?",
            },
            {
              id: "mono-xs",
              cls: "type-mono-xs",
              sample: "14:02 · deep work · 4 chomps",
            },
          ].map((row) => (
            <div
              key={row.id}
              className="flex flex-wrap items-baseline gap-6 border-b-2 border-foreground/25 pb-6"
            >
              <span className="w-[140px] shrink-0 font-mono text-xs tracking-[1px] text-accent-text">
                {row.id}
              </span>
              <span className={cn("min-w-0 text-foreground", row.cls)}>
                {row.sample}
              </span>
            </div>
          ))}
          <div className="type-display-2 type-display-stroke">Outlined</div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section n="03" title="Parts" aside="shadcn/ui overrides">
        <div className="grid border-[3px] border-foreground lg:grid-cols-2">
          <Cell
            label="Button"
            className="border-b-2 lg:border-r-2"
            note="Slab physics — rest 5px, hover −3px with an 8px offset, active flush at 0. The shadow is always the opposite accent. Min hit target 48px."
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-5">
              <Button>Start session</Button>
              <Button variant="outline">Secondary</Button>
              <Button variant="destructive">Kill it</Button>
              <Button variant="ghost">Ghost</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="mt-6">
              <Button variant="slam" size="slam">
                Chomp it
              </Button>
            </div>
          </Cell>

          <Cell
            label="Input / Select / Slider"
            className="border-b-2"
            note="Focus is a 2px border plus a 4px hard shadow — never colour alone. Error swaps the border to riot and appends a mono message beneath."
          >
            <div className="flex max-w-[420px] flex-col gap-[18px]">
              <div>
                <label htmlFor="ks-task" className="type-label mb-2 block">
                  What are you chomping?
                </label>
                <Input id="ks-task" placeholder="Rewrite the onboarding copy" />
              </div>
              <div>
                <label htmlFor="ks-err" className="type-label mb-2 block">
                  Focus minutes
                </label>
                <Input id="ks-err" defaultValue="900" aria-invalid />
                <p className="type-mono-xs mt-2 text-secondary">
                  Between 5 and 180 minutes
                </p>
              </div>
              <div>
                <div className="mb-2 flex justify-between font-mono text-xs tracking-[1px] text-muted-foreground uppercase">
                  <span id="ks-vol">Volume</span>
                  <span className="text-accent-text tabular-nums">
                    {volume}%
                  </span>
                </div>
                <Slider
                  aria-labelledby="ks-vol"
                  value={volume}
                  onValueChange={(v) =>
                    setVolume(Array.isArray(v) ? (v[0] ?? 0) : v)
                  }
                />
              </div>
              <div className="flex items-center gap-4">
                <Checkbox
                  id="ks-check"
                  checked={checked}
                  onCheckedChange={setChecked}
                />
                <label htmlFor="ks-check" className="text-base font-medium">
                  Answer the Figma comments
                </label>
              </div>
            </div>
          </Cell>

          <Cell
            label="Badge / Chip / Sticker"
            className="border-b-2 lg:border-r-2"
            note="Stickers are reward-only. They appear on completion, rotate between −14° and +14°, and never carry information you can't get elsewhere."
          >
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge>Focus</Badge>
              <Badge variant="destructive">Overrun</Badge>
              <Badge variant="outline">Break</Badge>
              <Badge variant="data">4 × 25m</Badge>
            </div>
            <div className="mb-6 flex flex-wrap gap-3">
              {["25 / 5", "50 / 10", "15 / 3"].map((label, i) => (
                <span
                  key={label}
                  className={
                    i === 0
                      ? "border-2 border-primary bg-primary px-[18px] py-[10px] font-mono text-sm font-bold text-primary-foreground"
                      : "border-2 border-foreground/35 px-[18px] py-[10px] font-mono text-sm font-bold text-foreground"
                  }
                >
                  {label}
                </span>
              ))}
              <span className="border-2 border-foreground/35 border-dashed px-[18px] py-[10px] font-mono text-sm font-bold text-foreground">
                Custom
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-7">
              <Sticker rotate={-12}>
                Chomp
                <br />
                #128
              </Sticker>
              <Sticker size={104} rotate={9}>
                Longest
                <br />
                run yet
              </Sticker>
            </div>
          </Cell>

          <Cell
            label="Card / Dialog / Toast"
            className="border-b-2"
            note="Elevated card = 2px border + 6px hard shadow. Flat card = hairline only. There is no third elevation."
          >
            <div className="flex flex-wrap gap-5">
              <Card className="min-w-[170px] flex-1">
                <CardHeader>
                  <CardTitle>Today</CardTitle>
                  <span className="font-display text-[56px] leading-none tracking-[-0.04em] text-accent-text">
                    04
                  </span>
                  <CardDescription>chomps · 1h 40m</CardDescription>
                </CardHeader>
              </Card>
              <Card variant="flat" className="min-w-[170px] flex-1">
                <CardHeader>
                  <CardTitle>Streak</CardTitle>
                  <span className="font-display text-[56px] leading-none tracking-[-0.04em] text-foreground">
                    11
                  </span>
                  <CardDescription>days · best 19</CardDescription>
                </CardHeader>
              </Card>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button variant="secondary" onClick={() => setDialogOpen(true)}>
                Open dialog
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast.add({
                    title: "Break's up",
                    description: "Back in 10 · or not, whatever",
                  })
                }
              >
                Fire toast
              </Button>
            </div>
          </Cell>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section n="04" title="States" aside="idle / focus / break / done">
        <p className="mb-10 max-w-[760px] text-lg leading-[1.55] text-muted-foreground text-pretty">
          The whole thesis in four frames: the app is loudest on either side of
          the work and nearly silent during it. Idle sells the session, focus
          protects it, done pays it off. These are the real components, not
          mock-ups.
        </p>
        <div className="grid gap-8 xl:grid-cols-2">
          <Frame label="01 idle" note="loud — pick something and go">
            <IdleScreen
              summary="04 TODAY · 11 DAY STREAK"
              taskTitle="Rewrite the onboarding copy"
              preset={{ focus: 25, break: 5 }}
              onSelectPreset={noop}
              onOpenCustom={noop}
              onOpenTasks={noop}
              onStart={noop}
            />
          </Frame>
          <Frame label="02 focus" note="calm core — type plus one live accent">
            <FocusScreen
              taskName="Rewrite the onboarding copy"
              sessionIndex={3}
              sessionTarget={4}
              remainingSec={16 * 60 + 12}
              progress={0.62}
              soundLabel="Brown noise · 60%"
              isPaused={false}
              onKill={noop}
              onTogglePause={noop}
            />
          </Frame>
          <Frame label="03 break" note="loud again — permission to leave">
            <BreakScreen remainingSec={5 * 60} onSkip={noop} onExtend={noop} />
          </Frame>
          <Frame label="04 done" note="the payoff — takeover plus sticker">
            <DoneScreen
              focusMinutes={25}
              lifetimeSessions={128}
              sessionsToday={4}
              sessionTarget={6}
              praise="That's four today. Longest run this month."
              onTakeBreak={noop}
            />
          </Frame>
        </div>
      </Section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              Kill this
              <br />
              session?
            </DialogTitle>
            <DialogDescription>
              Nothing is logged, nothing is lost, nobody is told. Come back when
              you feel like it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={() => setDialogOpen(false)}>
              Kill it
            </Button>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Keep going
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* This dialog is a SPECIMEN of the component. The focus screen's KILL IT
          is never wired to a confirmation — see the no-guilt clause. */}
      <Toaster />
    </div>
  );
}
