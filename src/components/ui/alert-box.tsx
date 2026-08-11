import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AlertBoxVariant = "danger" | "info";

export interface AlertBoxProps {
  variant: AlertBoxVariant;
  title: string;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<AlertBoxVariant, string> = {
  danger: "border-2 border-[#BC5434] bg-[#F8E9E4] rounded-xl p-5 md:p-6 text-[#1A241C]",
  info: "border-2 border-[#8B4A3A] bg-[#A05A48] rounded-xl p-5 md:p-6",
};

function AlertBox({ variant, title, children, className }: AlertBoxProps) {
  const isDanger = variant === "danger";

  return (
    <div role="note" className={cn(variantStyles[variant], className)}>
      <p
        className={cn(
          "mb-2 font-sans text-lg font-bold tracking-[0.04em] md:text-xl",
          isDanger ? "text-[#BC5434]" : "text-white"
        )}
      >
        {title}
      </p>
      <div
        className={cn(
          "text-sm leading-relaxed",
          isDanger ? "text-[#2A2A24]/90" : "text-white/90"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { AlertBox };
