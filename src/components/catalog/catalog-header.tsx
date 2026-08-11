import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { HeroPhoneLink } from "@/components/home/hero-phone-link";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import { cn } from "@/lib/utils";

const DESKTOP_INSET = "md:px-[15vw]";

export function CatalogHeader() {
  return (
    <header className="w-full border-b border-stone-200/60 bg-[#FBFBFA]">
      <div
        className={cn(
          "mx-auto flex w-full items-center justify-between gap-4 px-6 py-4 md:py-5",
          DESKTOP_INSET
        )}
      >
        <Button
          variant="ghost"
          href="/"
          className="flex items-center gap-2 px-0 text-sm font-sans font-medium text-stone-600 hover:bg-transparent hover:text-[#BC5434]"
        >
          {UI_CONFIG.catalog.backToHome}
        </Button>

        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
          <Typography
            variant="h3"
            className="font-serif text-base tracking-wide text-[#1A241C] md:text-lg"
          >
            {GLOBAL_CONFIG.brandName}
          </Typography>
          <HeroPhoneLink
            phone={GLOBAL_CONFIG.phone}
            className="static font-sans text-sm font-semibold tracking-wide text-stone-600 md:text-base"
            linkClassName="hover:text-[#BC5434]"
          />
        </div>
      </div>
    </header>
  );
}
