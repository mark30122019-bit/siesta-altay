import { cn } from "@/lib/utils";

type BadgeVariant = "tour" | "action" | "count";

export interface BadgeProps {
  variant: BadgeVariant;
  text: string;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  tour: "inline-flex items-center rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white",
  action:
    "inline-flex items-center rounded-lg bg-black/40 px-3 py-1.5 text-sm font-semibold text-white",
  count:
    "absolute inset-0 flex items-center justify-center bg-black/50 text-base font-medium text-white backdrop-blur-[2px]",
};

function Badge({ variant, text, className }: BadgeProps) {
  return <span className={cn(variantStyles[variant], className)}>{text}</span>;
}

export { Badge };
