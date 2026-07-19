import React, { type ComponentPropsWithoutRef, type CSSProperties } from "react"

import { cn } from "@/lib/utils"

interface RippleProps extends ComponentPropsWithoutRef<"div"> {
  mainCircleSize?: number
  mainCircleOpacity?: number
  numCircles?: number
}

export const Ripple = React.memo(function Ripple({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className,
  ...props
}: RippleProps) {
  const palette = ["#CFEAFF", "#7EC8FF", "#7FD6C2", "#2FAE8F"];

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none",
        className
      )}
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 80
        const opacity = mainCircleOpacity - i * 0.03
        const animationDelay = `${i * 0.06}s`
        const borderStyle = "solid"

        // Soft institutional blue/green palette for borders, with CSS variable overrides
        const circleColor = `var(--ripple-color, ${palette[i % palette.length]})`
        const circleBg = `var(--ripple-bg, ${palette[i % palette.length]}12)` // light background fill (~7% opacity)

        return (
          <div
            key={i}
            className="animate-ripple absolute rounded-full border shadow-sm"
            style={
              {
                "--i": i,
                width: `${size}px`,
                height: `${size}px`,
                opacity: Math.max(opacity, 0.01),
                animationDelay,
                borderStyle,
                borderWidth: "1px",
                borderColor: circleColor,
                backgroundColor: circleBg,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) scale(1)",
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
})

Ripple.displayName = "Ripple"
