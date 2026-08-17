import Link from "next/link";

/**
 * Logo + wordmark, linked home. Shared so every screen's mark is pixel-for-
 * pixel identical — this is also the "back to landing" control on /timer.
 */
export function ChompMark() {
  return (
    <Link href="/" className="flex items-center gap-3">
      {/** biome-ignore lint/performance/noImgElement: static site asset, no next/image config needed for a single small mark */}
      <img
        src="/chomp-logo.svg"
        alt="Back to Chomp home"
        className="size-[34px]"
      />
      <span className="font-display text-[22px] tracking-[-0.03em] text-foreground uppercase">
        Chomp<span className="text-accent-text">*</span>
      </span>
    </Link>
  );
}
