"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { UI_CONFIG } from "@/config/uiConfig";
import { cn } from "@/lib/utils";

const HERO_ID = "hero";
const NEXT_SECTION_ID = "about";

export function HeroScrollDown({ className }: { className?: string }) {
  const [hidden, setHidden] = useState(false);

  function handleClick() {
    const next = document.getElementById(NEXT_SECTION_ID);
    if (!next) return;

    setHidden(true);
    next.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (hidden) return null;

  return (
    <div className="flex items-center justify-center bg-[#FFFbf7] py-3">
      <Button
        variant="ghost"
        type="button"
        onClick={handleClick}
        aria-label={UI_CONFIG.home.scrollDownAria}
        className={cn(
          "btn-tactile h-12 w-12 rounded-full border border-[#1A241C]/25 bg-white/70 p-0 text-[#1A241C] shadow-[0_4px_16px_rgba(26,36,28,0.1)] backdrop-blur-sm transition-colors hover:border-[#1A241C]/45 hover:bg-white hover:text-[#BC5434]",
          className
        )}
      >
        <Icon name="chevronDown" size={22} />
      </Button>
    </div>
  );
}

export { HERO_ID };
