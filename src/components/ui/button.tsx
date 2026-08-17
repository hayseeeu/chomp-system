import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * CHOMP slab physics — every variant shares it:
 *   rest    5px offset
 *   hover   translate(-3px,-3px), shadow grows to 8px
 *   active  translate(+5px,+5px), shadow 0 — it presses flush into its shadow
 * 90ms ease-out on transform and box-shadow only. Nothing else animates.
 * The shadow is always the OPPOSITE accent: acid casts riot, riot casts acid,
 * cream/neutral casts acid. Never soft, never black.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border-2 border-transparent font-sans text-sm font-extrabold tracking-[0.8px] whitespace-nowrap uppercase transition-[transform,box-shadow] duration-90 ease-out outline-none select-none focus-visible:border-ring focus-visible:shadow-[4px_4px_0_0_var(--ring)] disabled:pointer-events-none disabled:border-foreground/20 disabled:bg-card disabled:text-muted-foreground disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // acid slab, casts riot
        default:
          "bg-primary text-primary-foreground shadow-[5px_5px_0_0_var(--secondary)] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[8px_8px_0_0_var(--secondary)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none",
        // outlined cream, casts acid
        outline:
          "border-foreground bg-transparent text-foreground shadow-[5px_5px_0_0_var(--primary)] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[8px_8px_0_0_var(--primary)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none",
        // riot slab — INK text, not cream. Casts acid. Riot is an EVENT colour:
        // alarm, overrun, delete. Never used to mark an abandoned session.
        destructive:
          "bg-secondary text-secondary-foreground shadow-[5px_5px_0_0_var(--primary)] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[8px_8px_0_0_var(--primary)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none",
        // cream slab, casts acid — used inside dialogs
        secondary:
          "bg-foreground text-background shadow-[5px_5px_0_0_var(--primary)] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[8px_8px_0_0_var(--primary)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none",
        // underline only, no slab
        ghost:
          "border-b-primary bg-transparent text-foreground hover:text-accent-text",
        // the one on the idle screen: full width, display type
        slam: "w-full bg-primary font-display text-[28px] tracking-[-0.02em] text-primary-foreground shadow-[7px_7px_0_0_var(--secondary)] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[10px_10px_0_0_var(--secondary)] active:translate-x-[7px] active:translate-y-[7px] active:shadow-none",
        link: "border-b-primary bg-transparent text-accent-text underline-offset-4 hover:underline",
      },
      size: {
        // min 48px hit target everywhere
        default: "min-h-12 px-7 py-4 text-sm",
        sm: "min-h-12 px-[18px] py-[10px] font-mono text-sm font-bold",
        lg: "min-h-14 px-8 py-5 text-base",
        slam: "min-h-[76px] p-[22px]",
        // Compact sizes exist only for the generated shadcn parts (calendar,
        // combobox, input-group). CHOMP's own screens never use them — every
        // control it ships is >= 48px.
        xs: "h-6 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        icon: "size-12",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
