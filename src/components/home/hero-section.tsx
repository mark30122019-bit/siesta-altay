import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { HeroPhoneLink } from "@/components/home/hero-phone-link";
import { HeroScrollDown, HERO_ID } from "@/components/home/hero-scroll-down";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";

export function HeroSection() {
  return (
    <section
      id={HERO_ID}
      className="relative flex h-[78vh] min-h-[520px] w-full items-center justify-center overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={UI_CONFIG.home.heroImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden />

      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 px-4 pt-5 sm:gap-6 sm:px-8 sm:pt-8 md:left-0 md:right-0 md:px-10 md:pt-10">
        <Typography
          variant="caption"
          className="min-w-0 max-w-[58%] font-sans text-2xl font-bold leading-snug tracking-[0.02em] text-white/95 sm:max-w-none sm:text-sm sm:tracking-wide md:text-base md:font-semibold md:text-white/80"
        >
          {GLOBAL_CONFIG.companyName}
        </Typography>

        <HeroPhoneLink
          phone={GLOBAL_CONFIG.phone}
          className="static shrink-0 text-right font-sans text-2xl font-medium tracking-[0.02em] text-white/95 sm:text-sm md:text-base md:font-semibold md:text-white/80"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <Typography
          variant="h1"
          className="mb-8 max-w-5xl font-serif text-[2rem] font-normal uppercase leading-[1.15] tracking-[0.12em] text-white sm:text-5xl md:mb-10 md:text-7xl md:tracking-[0.14em]"
        >
          {UI_CONFIG.home.heroTitle}
        </Typography>

        <Button
          variant="ghost"
          href={UI_CONFIG.home.catalogHref}
          className="rounded-full border border-white bg-transparent px-8 py-3 text-sm font-normal tracking-wide text-white hover:bg-white hover:text-[#1A241C]"
        >
          {UI_CONFIG.home.chooseLocation}
        </Button>
      </div>

      <HeroScrollDown />
    </section>
  );
}
