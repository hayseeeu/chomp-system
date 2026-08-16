import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/** Square, uppercase, 12px/700/0.1em. `destructive` is riot with INK text. */
const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 border-2 border-transparent px-3 py-1.5 font-sans text-[12px] leading-none font-bold tracking-[0.1em] whitespace-nowrap uppercase outline-none focus-visible:border-ring focus-visible:shadow-[4px_4px_0_0_var(--ring)] [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-foreground text-background",
        // riot with ink text — the contrast rule, not a preference
        destructive: "bg-secondary text-secondary-foreground",
        outline: "border-foreground text-foreground",
        // soot ground, muted mono — for counts and durations
        data: "bg-card font-mono text-[12px] font-semibold tracking-[0.08em] text-muted-foreground normal-case",
        ghost: "text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
