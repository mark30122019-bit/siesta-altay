import Link from "next/link";

import { Button } from "@/components/ui/button";
import { HeroPhoneLink } from "@/components/home/hero-phone-link";
import { GLOBAL_CONFIG } from "@/config/global";
import { cn } from "@/lib/utils";

const DESKTOP_INSET = "md:px-[15vw]";

export type SiteHeaderProps = {
  backHref: string;
  backLabel: string;
  className?: string;
};

export function SiteHeader({
  backHref,
  backLabel,
  className,
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "site-chrome w-full border-b",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full items-center justify-between gap-4 px-6 py-5 md:py-6",
          DESKTOP_INSET
        )}
      >
        <div className="flex min-w-0 flex-col gap-2">
          <Link
            href="/"
            className="cursor-pointer font-serif text-lg font-normal tracking-[0.06em] text-[#F5EFE0] transition-colors hover:text-white md:text-xl"
          >
            {GLOBAL_CONFIG.brandName}
          </Link>
          <Button
            variant="ghost"
            href={backHref}
            className="w-fit px-0 py-0 font-sans text-[13px] font-medium tracking-wide text-white/80 hover:bg-transparent hover:text-white md:text-sm"
          >
            {backLabel}
          </Button>
        </div>

        <HeroPhoneLink
          phone={GLOBAL_CONFIG.phone}
          className="static shrink-0 self-center font-sans text-[15px] font-semibold tracking-wide text-[#D4A24A] md:text-base"
          linkClassName="hover:text-[#E8B85C]"
        />
      </div>
    </header>
  );
}
