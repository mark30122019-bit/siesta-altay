import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface CardProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E8E0D4]/90 bg-[#f8f8f0] shadow-[0_16px_48px_rgba(42,36,28,0.045)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Card };
