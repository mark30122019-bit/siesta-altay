"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      tone: {
        terracotta:
          "border-border bg-card text-foreground hover:border-terracotta/50 data-[active=true]:border-terracotta data-[active=true]:bg-terracotta data-[active=true]:text-terracotta-foreground",
        olive:
          "border-border bg-card text-foreground hover:border-olive/50 data-[active=true]:border-olive data-[active=true]:bg-olive data-[active=true]:text-olive-foreground",
      },
    },
    defaultVariants: {
      tone: "terracotta",
    },
  }
);

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof chipVariants> {
  label: string;
  isActive?: boolean;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    { className, label, isActive = false, tone, type = "button", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        data-active={isActive}
        aria-pressed={isActive}
        className={cn(chipVariants({ tone, className }))}
        {...props}
      >
        {label}
      </button>
    );
  }
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
