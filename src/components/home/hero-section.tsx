import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[78vh] w-full items-center justify-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={UI_CONFIG.home.heroImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/50"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-20 text-center">
        <Typography
          variant="caption"
          className="absolute left-6 top-8 text-white/90 md:left-0 md:top-10"
        >
          {GLOBAL_CONFIG.companyName}
        </Typography>

        <Typography
          variant="h1"
          className="mt-16 max-w-4xl uppercase tracking-[0.08em] text-white md:mt-8 md:text-5xl lg:text-6xl"
        >
          {UI_CONFIG.home.heroTitle}
        </Typography>

        <Button
          variant="ghost"
          href="#catalog"
          className="mt-10 rounded-full border border-white/90 px-8 text-white hover:bg-white/10"
        >
          {UI_CONFIG.home.chooseLocation}
        </Button>
      </div>
    </section>
  );
}
