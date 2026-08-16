"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { IconX } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

/**
 * A 22px square with a 2px border. Checked floods acid and marks with an ink
 * cross — the reference uses a cross, not a tick. The `after` pseudo-element
 * extends the hit target to 48px without changing the drawn size.
 */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-[22px] shrink-0 items-center justify-center border-2 border-foreground bg-transparent transition-[box-shadow,background-color] duration-90 ease-out outline-none after:absolute after:-inset-[13px] after:content-[''] focus-visible:border-ring focus-visible:shadow-[4px_4px_0_0_var(--ring)] disabled:cursor-not-allowed disabled:border-foreground/20 aria-invalid:border-secondary data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5 [&>svg]:stroke-[4]"
      >
        <IconX />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
