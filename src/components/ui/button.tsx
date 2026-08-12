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
    "border border-[#BC5434]/80 bg-gradient-to-b from-white/90 to-[#FBF6F2] text-[#BC5434] font-semibold tracking-wide rounded-xl shadow-[0_2px_10px_rgba(188,84,52,0.12)] hover:border-[#BC5434] hover:from-[#BC5434] hover:to-[#a0482c] hover:text-white hover:shadow-[0_6px_20px_rgba(188,84,52,0.22)]",
  fill: "bg-gradient-to-b from-[#556B58] to-[#3D4F40] text-white font-semibold rounded-xl shadow-[0_4px_16px_rgba(61,79,64,0.28)] hover:from-[#4A5D4E] hover:to-[#354538] hover:shadow-[0_8px_24px_rgba(61,79,64,0.32)]",
  ghost:
    "bg-transparent text-[#1A241C] font-medium rounded-xl hover:bg-black/[0.04]",
};

const baseStyles =
  "btn-tactile inline-flex items-center justify-center px-5 py-2.5 text-sm";

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
