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
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-sans text-sm text-[#1A241C]",
        "placeholder:text-gray-400",
        "transition-colors duration-200",
        "focus:border-[#4A5D4E] focus:outline-none focus:ring-0",
        className
      )}
    />
  );
}

export { Input };
