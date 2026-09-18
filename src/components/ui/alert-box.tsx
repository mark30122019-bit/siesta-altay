import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AlertBoxVariant = "danger" | "info";

export interface AlertBoxProps {
  variant: AlertBoxVariant;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<AlertBoxVariant, string> = {
  danger:
    "border border-black/[0.06] bg-gradient-to-br from-[#FAF0EB] to-[#F3E6E0] rounded-2xl p-5 md:p-7 text-[#1A241C] shadow-[var(--shadow-card)]",
  info: "border border-black/[0.08] bg-gradient-to-br from-[#9A6454] to-[#7A4E42] rounded-2xl p-5 md:p-7 shadow-[var(--shadow-card-hover)]",
};

function AlertBox({ variant, title, lead, children, className }: AlertBoxProps) {
  const isDanger = variant === "danger";

  return (
    <div role="note" className={cn(variantStyles[variant], className)}>
      <h2
        className={cn(
          "font-serif text-xl font-normal tracking-wide md:text-2xl",
          lead ? "mb-2" : "mb-4",
          isDanger ? "text-[#1A241C]" : "text-[#F7F3ED]"
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "mb-4 max-w-prose font-sans text-sm leading-relaxed md:text-[15px]",
            isDanger ? "text-[#6B635A]" : "text-[#F7F3ED]/80"
          )}
        >
          {lead}
        </p>
      ) : null}
      <div
        className={cn(
          "text-sm leading-relaxed",
          isDanger ? "text-[#3D3832]/85" : "text-[#F7F3ED]/88"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { AlertBox };
