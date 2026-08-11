"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type ButtonVariant = "fill" | "outline" | "ghost";

export interface ButtonProps {
  variant: ButtonVariant;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  href?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  outline:
    "border border-[#BC5434] bg-transparent text-[#BC5434] font-semibold tracking-wide rounded-lg hover:bg-[#BC5434] hover:text-white",
  fill: "bg-[#4A5D4E] text-white font-semibold rounded-lg hover:bg-[#3B4A3E]",
  ghost:
    "bg-transparent text-[#1A241C] font-medium rounded-lg hover:bg-black/5",
};

const baseStyles =
  "inline-flex items-center justify-center px-5 py-2.5 text-sm transition-colors duration-300";

function Button({
  variant,
  children,
  onClick,
  className,
  type = "button",
  href,
}: ButtonProps) {
  const classes = cn(baseStyles, variantStyles[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export { Button };
