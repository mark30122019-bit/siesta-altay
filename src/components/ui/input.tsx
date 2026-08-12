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
        "w-full rounded-md border border-[#E0D8CE] bg-[#FBF8F3] px-4 py-3 font-sans text-sm text-[#1A241C]",
        "placeholder:text-[#9A9288]",
        "transition-[border-color,box-shadow,background-color] duration-300",
        "outline-none ring-0",
        "focus:border-[#A05A48] focus:bg-[#FFFcf8] focus:outline-none focus:ring-0",
        "focus-visible:border-[#A05A48] focus-visible:outline-none focus-visible:ring-0",
        className
      )}
    />
  );
}

export { Input };
