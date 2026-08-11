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

      <Typography
        variant="caption"
        className="absolute left-8 top-8 z-10 font-sans text-xl font-bold tracking-wide text-white/80 md:left-10 md:top-10"
      >
        {GLOBAL_CONFIG.companyName}
      </Typography>

      <HeroPhoneLink phone={GLOBAL_CONFIG.phone} />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <Typography
          variant="h1"
          className="mb-8 max-w-5xl font-serif text-5xl font-normal uppercase leading-[1.1] tracking-[0.14em] text-white md:mb-10 md:text-7xl"
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
