"use client";

import type { ChangeEvent } from "react";

import { cn } from "@/lib/utils";

export interface InputProps {
  type?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

function Input({
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  required,
  className,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={cn(
        "w-full rounded-xl border border-black/[0.06] bg-gradient-to-b from-white/90 to-[#FAF7F2] px-4 py-3 font-sans text-sm text-[#1A241C]",
        "shadow-[var(--shadow-input)]",
        "placeholder:text-[#9A9288]",
        "transition-[border-color,box-shadow,background-color,transform] duration-300",
        "outline-none ring-0",
        "focus:border-[#BC5434]/35 focus:bg-white focus:shadow-[var(--shadow-input-focus)] focus:outline-none focus:ring-0",
        "focus-visible:border-[#BC5434]/35 focus-visible:outline-none focus-visible:ring-0",
        className
      )}
    />
  );
}

export { Input };
