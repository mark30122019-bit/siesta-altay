import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HeroPhoneLink } from "@/components/home/hero-phone-link";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import { cn } from "@/lib/utils";

const DESKTOP_INSET = "md:px-[15vw]";

export function CatalogHeader() {
  return (
    <header className="w-full border-b border-[#f8f8f0] bg-[#f8f8f0]">
      <div
        className={cn(
          "mx-auto flex w-full items-center justify-between gap-4 px-6 py-5 md:py-6",
          DESKTOP_INSET
        )}
      >
        <Button
          variant="ghost"
          href="/"
          className="flex items-center gap-2 px-0 font-sans text-[15px] font-medium tracking-wide text-[#6B635A] hover:bg-transparent hover:text-[#8F5A4A] md:text-sm"
        >
          {UI_CONFIG.catalog.backToHome}
        </Button>

        <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1">
          <Link
            href="/"
            className="cursor-pointer font-serif text-lg font-normal tracking-[0.06em] text-[#1A241C] transition-colors hover:text-[#8F5A4A] md:text-lg"
          >
            {GLOBAL_CONFIG.brandName}
          </Link>
          <HeroPhoneLink
            phone={GLOBAL_CONFIG.phone}
            className="static font-sans text-[15px] font-medium tracking-wide text-[#6B635A] md:text-base"
            linkClassName="hover:text-[#8F5A4A]"
          />
        </div>
      </div>
    </header>
  );
}
