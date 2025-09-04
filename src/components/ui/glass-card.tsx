import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  blur?: "sm" | "md" | "lg" | "xl"
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, blur = "md", children, ...props }, ref) => {
    const blurClasses = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border border-white/20",
          "bg-gradient-to-br from-white/10 to-white/5",
          blurClasses[blur],
          "shadow-xl",
          hover && "transition-all duration-300 hover:from-white/15 hover:to-white/10 hover:shadow-2xl hover:scale-[1.02]",
          className
        )}
        {...props}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
        {children}
      </div>
    )
  }
)
GlassCard.displayName = "GlassCard"

export { GlassCard }