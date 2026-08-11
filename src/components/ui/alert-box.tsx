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
  danger: "border-2 border-[#BC5434] bg-[#2B3A2F] rounded-xl p-5 md:p-6",
  info: "border border-gray-200 bg-[#E8ECDF] rounded-xl p-5 md:p-6 text-[#1A241C]",
};

function AlertBox({ variant, title, children, className }: AlertBoxProps) {
  const isDanger = variant === "danger";

  return (
    <div role="note" className={cn(variantStyles[variant], className)}>
      <p
        className={cn(
          "mb-2 font-semibold",
          isDanger ? "text-white" : "text-[#1A241C]"
        )}
      >
        {title}
      </p>
      <div
        className={cn(
          "text-sm leading-relaxed",
          isDanger ? "text-white/90" : "text-[#1A241C]/90"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { AlertBox };
