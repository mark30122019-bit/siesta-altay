"use client";

import { cn } from "@/lib/utils";

export interface ChipProps {
  label: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
}

function Chip({ label, isActive, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        "btn-tactile inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm",
        isActive
          ? "border border-transparent bg-gradient-to-b from-[#c86648] to-[#a8482c] text-white shadow-[0_4px_14px_rgba(188,84,52,0.28)]"
          : "border border-black/[0.06] bg-gradient-to-b from-white/80 to-[#F3EEE6] text-[#1A241C] hover:border-black/[0.1] hover:shadow-[0_4px_12px_rgba(42,36,28,0.06)]",
        className
      )}
    >
      {label}
    </button>
  );
}

export { Chip };
