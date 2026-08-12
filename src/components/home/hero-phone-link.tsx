"use client";

import { type MouseEvent } from "react";

import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type HeroPhoneLinkProps = {
  phone: string;
  className?: string;
  linkClassName?: string;
};

function canHoverFine() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

export function HeroPhoneLink({
  phone,
  className,
  linkClassName,
}: HeroPhoneLinkProps) {
  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Desktop: only copy. Mobile: copy + keep tel: dial.
    if (canHoverFine()) {
      event.preventDefault();
    }
    try {
      await navigator.clipboard.writeText(phone);
    } catch {
      // clipboard may be blocked
    }
  }

  return (
    <Typography
      variant="caption"
      className={cn(
        "absolute right-8 top-8 z-10 font-sans text-sm font-medium tracking-wide text-white/80 md:right-10 md:top-10 md:text-base md:font-semibold",
        className
      )}
    >
      <a
        href={`tel:${phone}`}
        className={cn("hover:text-white", linkClassName)}
        onClick={handleClick}
        aria-label={phone}
      >
        {phone}
      </a>
    </Typography>
  );
}
