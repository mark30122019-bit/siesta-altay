"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { UI_CONFIG } from "@/config/uiConfig";

const HERO_ID = "hero";

export function HeroScrollDown() {
  function handleClick() {
    const hero = document.getElementById(HERO_ID);
    if (!hero) return;

    window.scrollTo({
      top: hero.offsetTop + hero.offsetHeight,
      behavior: "smooth",
    });
  }

  return (
    <Button
      variant="ghost"
      type="button"
      onClick={handleClick}
      aria-label={UI_CONFIG.home.scrollDownAria}
      className="absolute bottom-8 left-1/2 z-10 h-12 w-12 -translate-x-1/2 rounded-full border border-white bg-transparent p-0 text-white hover:bg-white hover:text-[#1A241C]"
    >
      <Icon name="chevronDown" size={22} />
    </Button>
  );
}

export { HERO_ID };
