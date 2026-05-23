"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    className?: string
}

export function RainbowButton({ children, className, ...props }: RainbowButtonProps) {
    return (
        <button
            className={cn(
                "group relative inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border-0 px-6 py-2 font-medium text-primary-foreground transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 overflow-hidden",
                // Background with primary color variations
                "bg-gradient-to-r from-primary to-primary",
                // Animated gradient background with primary variations
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/80 before:via-primary before:to-primary/60 before:bg-[length:200%_100%] before:animate-pulse before:opacity-90",
                // Glow effect with primary color
                "after:absolute after:inset-0 after:bg-gradient-to-r after:from-primary/20 after:via-primary/30 after:to-primary/20 after:blur-sm after:opacity-50",
                className
            )}
            style={{
                background: `linear-gradient(135deg, 
          hsl(var(--primary) / 0.9), 
          hsl(var(--primary)), 
          hsl(var(--primary) / 0.8), 
          hsl(var(--primary) / 1.1), 
          hsl(var(--primary) / 0.9)
        )`,
                backgroundSize: '200% 100%',
                animation: 'rainbow-slide 3s ease-in-out infinite'
            }}
            {...props}
        >
            <span className="relative z-10">{children}</span>
        </button>
    )
}
