import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { HeroBackground } from "@/components/home/hero-background";
import { HeroScrollDown, HERO_ID } from "@/components/home/hero-scroll-down";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";

const heroCtaClass =
  "btn-tactile min-w-0 flex-1 rounded-full border border-[#B0AAA0]/55 bg-[#121812]/45 px-2.5 py-2.5 text-center text-[11px] font-medium leading-snug tracking-wide text-white shadow-[0_4px_14px_rgba(0,0,0,0.16)] backdrop-blur-md transition-all duration-300 hover:border-[#D4CFC6] hover:bg-white hover:text-[#1A241C] hover:shadow-[0_6px_18px_rgba(0,0,0,0.14)] sm:px-5 sm:py-3 sm:text-sm";

export function HeroSection() {
  return (
    <div>
      <section
        id={HERO_ID}
        className="relative flex h-[90dvh] min-h-[520px] w-full flex-col overflow-hidden"
      >
        <HeroBackground />
        <div className="absolute inset-0 z-[1] bg-black/40" aria-hidden />

        <header className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 px-6 pt-8 sm:px-10 sm:pt-10 md:px-12 md:pt-12">
          <Link
            href={UI_CONFIG.routing.home.href}
            className="group min-w-0 max-w-[58%] text-left"
          >
            <span className="mt-1 block font-serif text-[17px] font-normal leading-snug tracking-[0.06em] text-white sm:text-[19px] md:text-[21px]">
              ООО Сиеста Центр
            </span>
            <span className="sr-only">{GLOBAL_CONFIG.companyName}</span>
          </Link>
        </header>

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-end pt-4 text-center">
            <Typography
              variant="h1"
              className="max-w-5xl font-serif text-[2rem] font-normal uppercase leading-[1.15] tracking-[0.12em] text-white sm:text-5xl md:text-7xl md:tracking-[0.14em]"
            >
              {UI_CONFIG.home.heroTitle}
            </Typography>
          </div>

          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-end pb-10 sm:pb-12">
            <p className="pb-4 font-sans text-[16px] font-semibold uppercase tracking-[0.2em] text-white sm:mb-6 sm:text-[16px]">
              {UI_CONFIG.home.heroCatalogsLabel}
            </p>
            <nav
              aria-label={UI_CONFIG.home.heroCatalogsLabel}
              className="flex w-full max-md:w-[80%] flex-row items-stretch justify-center gap-3 max-md:flex-col sm:gap-3"
            >
              <Button
                variant="ghost"
                href={UI_CONFIG.routing.catalog.href}
                className={heroCtaClass}
              >
                {UI_CONFIG.home.heroLeisureCta}
              </Button>
              <Button
                variant="ghost"
                href={UI_CONFIG.routing.corporate.href}
                className={heroCtaClass}
              >
                {UI_CONFIG.home.heroEventsCta}
              </Button>
              <Button
                variant="ghost"
                href={UI_CONFIG.routing.weddings.href}
                className={heroCtaClass}
              >
                {UI_CONFIG.home.heroWeddingsCta}
              </Button>
            </nav>
          </div>
        </div>
      </section>

      <HeroScrollDown />
    </div>
  );
}
