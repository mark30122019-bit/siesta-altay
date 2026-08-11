"use client";

import { useRef, useState } from "react";

import { Typography } from "@/components/ui/typography";
import { UI_CONFIG } from "@/config/uiConfig";
import { cn } from "@/lib/utils";

type HeroPhoneLinkProps = {
  phone: string;
  className?: string;
};

function canHoverFine() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

export function HeroPhoneLink({ phone, className }: HeroPhoneLinkProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard may be blocked — tel: still works on click
    }
  }

  function handleMouseEnter() {
    if (canHoverFine()) {
      void copyPhone();
    }
  }

  return (
    <Typography
      variant="caption"
      className={cn(
        "absolute right-8 top-8 z-10 font-sans text-xl font-semibold tracking-wide text-white/80 md:right-10 md:top-10 md:text-base",
        className
      )}
    >
      <a
        href={`tel:${phone}`}
        className="hover:text-white"
        onMouseEnter={handleMouseEnter}
        title={copied ? UI_CONFIG.home.phoneCopied : phone}
        aria-label={copied ? UI_CONFIG.home.phoneCopied : phone}
      >
        {phone}
      </a>
    </Typography>
  );
}
