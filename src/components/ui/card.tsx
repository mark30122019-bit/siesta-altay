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
        "rounded-2xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.015)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Card };
