import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type TypographyVariant = "h1" | "h2" | "h3" | "lead" | "body" | "caption";

export interface TypographyProps {
  variant: TypographyVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: "font-serif text-3xl md:text-4xl font-normal text-[#1A241C] tracking-wide",
  h2: "font-sans text-xl md:text-2xl font-semibold text-[#1A241C]",
  h3: "font-serif text-lg md:text-xl font-medium text-[#1A241C]",
  lead: "font-serif text-base md:text-lg italic text-[#2B3A2F]/90 leading-relaxed",
  body: "font-sans text-sm md:text-base font-normal text-[#333333] leading-relaxed",
  caption: "font-sans text-xs md:text-sm font-normal text-gray-500",
};

const variantTags: Record<TypographyVariant, "h1" | "h2" | "h3" | "p" | "span"> =
  {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    lead: "p",
    body: "p",
    caption: "span",
  };

function Typography({ variant, children, className }: TypographyProps) {
  const Comp = variantTags[variant];

  return (
    <Comp className={cn(variantStyles[variant], className)}>{children}</Comp>
  );
}

export { Typography };
