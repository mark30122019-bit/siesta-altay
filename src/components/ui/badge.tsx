import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center font-sans font-medium transition-colors",
  {
    variants: {
      variant: {
        /** Контрастный бейдж «3D-тур» */
        tour: "rounded-md bg-foreground px-2.5 py-1 text-xs uppercase tracking-wide text-background",
        /** Счётчик фото «+3» */
        count:
          "rounded-md bg-background/90 px-2 py-0.5 text-xs text-foreground backdrop-blur-sm border border-border",
        /** Круглая метка «Организация под ключ» */
        promo:
          "rounded-full bg-olive px-3 py-1.5 text-[11px] uppercase tracking-wider text-olive-foreground shadow-sm",
      },
    },
    defaultVariants: {
      variant: "tour",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
