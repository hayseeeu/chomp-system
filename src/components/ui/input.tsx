import { Input as InputPrimitive } from "@base-ui/react/input"
import type * as React from "react"

import { cn } from "@/lib/utils"

/**
 * 2px cream border, ink ground, 16px Archivo. Focus is a coloured border PLUS
 * a 4px hard shadow — never colour alone. Error swaps the border to riot and
 * expects an 11px mono message beneath it (see FieldError in the kitchen sink).
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "min-h-12 w-full min-w-0 border-2 border-input bg-background px-4 py-[14px] font-sans text-base text-foreground transition-[box-shadow] duration-90 ease-out outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:shadow-[4px_4px_0_0_var(--ring)] disabled:pointer-events-none disabled:border-foreground/20 disabled:bg-card disabled:text-muted-foreground aria-invalid:border-secondary aria-invalid:focus-visible:shadow-[4px_4px_0_0_var(--secondary)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
