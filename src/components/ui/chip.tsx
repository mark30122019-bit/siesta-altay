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
        "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm transition-colors duration-200",
        isActive
          ? "border-none bg-[#BC5434] text-white shadow-sm shadow-[#BC5434]/30"
          : "border border-gray-200 bg-transparent text-[#1A241C] hover:border-gray-300 hover:bg-gray-50",
        className
      )}
    >
      {label}
    </button>
  );
}

export { Chip };
