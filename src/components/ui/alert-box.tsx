import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertBoxVariants = cva(
  "rounded-xl border px-5 py-4 font-sans text-sm leading-relaxed",
  {
    variants: {
      variant: {
        /** Обязательный блок «КОМУ НЕ ПОДОЙДЕТ» */
        danger:
          "border-danger bg-danger-bg text-danger-foreground",
        /** Манифест «Почему Сиеста» */
        info: "border-info bg-info-bg text-info-foreground",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export interface AlertBoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertBoxVariants> {
  title?: string;
}

function AlertBox({
  className,
  variant,
  title,
  children,
  ...props
}: AlertBoxProps) {
  return (
    <div
      role="note"
      className={cn(alertBoxVariants({ variant, className }))}
      {...props}
    >
      {title ? (
        <p className="mb-2 font-serif text-base font-semibold tracking-wide">
          {title}
        </p>
      ) : null}
      {children}
    </div>
  );
}

export { AlertBox, alertBoxVariants };
