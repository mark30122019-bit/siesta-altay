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
    "rounded-2xl border border-black/[0.06] bg-[linear-gradient(180deg,#fbf6f3_0%,#f3e6e0_100%)] p-5 text-[#1A241C] shadow-[var(--shadow-card)] md:p-7",
  info: "rounded-2xl border border-black/[0.08] bg-[linear-gradient(180deg,#9A6454_0%,#7A4E42_100%)] p-5 shadow-[var(--shadow-card)] md:p-7",
};

function AlertBox({ variant, title, lead, children, className }: AlertBoxProps) {
  const isDanger = variant === "danger";

  return (
    <div role="note" className={cn(variantStyles[variant], className)}>
      <h2
        className={cn(
          "font-serif text-xl font-normal tracking-wide md:text-2xl",
          lead ? "mb-0" : "mb-4",
          isDanger ? "text-[#1A241C]" : "text-[#F7F3ED]"
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "my-4 max-w-prose font-sans text-sm leading-relaxed md:my-5 md:text-[15px]",
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
