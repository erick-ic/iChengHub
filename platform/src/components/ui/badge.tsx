import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      {
        "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent": variant === "default",
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent": variant === "secondary",
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-transparent": variant === "destructive",
        "text-foreground": variant === "outline",
      },
      className
    )}
    {...props}
  />
))
Badge.displayName = "Badge"

export { Badge }