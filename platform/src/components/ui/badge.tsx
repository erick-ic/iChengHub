import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
>(({ className, variant = "default", children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium tracking-wide select-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      {
        "bg-gray-50/70 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-200/80 dark:ring-gray-700/70 hover:bg-white hover:ring-[#e52129]/30 hover:text-[#e52129] dark:hover:bg-gray-800": variant === "default",
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent": variant === "secondary",
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-transparent": variant === "destructive",
        "text-foreground": variant === "outline",
      },
      className
    )}
    {...props}
  >
    {variant === "default" && (
      <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0 opacity-70" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11.778 2.066H5.722A2.222 2.222 0 0 0 3.5 4.288v6.056a2.222 2.222 0 0 0 .654 1.576l7.412 7.412a2.222 2.222 0 0 0 3.143 0l4.426-4.426a2.222 2.222 0 0 0 0-3.143L13.35 2.72a2.222 2.222 0 0 0-1.572-.654Z"/>
        <circle cx="7.556" cy="7.556" r="1.333"/>
      </svg>
    )}
    {children}
  </div>
))
Badge.displayName = "Badge"

export { Badge }