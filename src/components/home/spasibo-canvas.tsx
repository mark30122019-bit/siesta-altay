"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { HeroPhoneLink } from "@/components/home/hero-phone-link";
import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";

const ease = [0.22, 1, 0.36, 1] as const;

export function SpasiboCanvas() {
  const copy = UI_CONFIG.spasibo;

  return (
    <section className="relative flex flex-1 flex-col items-center justify-center px-6 py-14 md:px-[10vw] md:py-20">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -left-[12%] top-[8%] size-[28rem] rounded-full bg-[#E8ECDF]/55 blur-3xl" />
        <div className="absolute -right-[10%] bottom-[6%] size-[26rem] rounded-full bg-[#F8E9E4]/45 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 size-[18rem] -translate-x-1/2 rounded-full bg-[#D4A24A]/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
        className="relative w-full max-w-xl"
      >
        <div className="surface-card relative overflow-hidden rounded-[1.75rem] px-7 py-12 text-center md:px-12 md:py-14">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4A24A]/55 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-[#E8ECDF]/70 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-14 size-56 rounded-full bg-[#F8E9E4]/60 blur-2xl"
            aria-hidden
          />

          <motion.div
            initial={{ scale: 0.82, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.08, ease }}
            className="relative mx-auto mb-7 flex size-[5.25rem] items-center justify-center"
          >
            <span
              className="absolute inset-0 rounded-full border border-[#5c6b3a]/18 bg-[#E8ECDF]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
              aria-hidden
            />
            <span
              className="absolute inset-[-6px] rounded-full border border-[#D4A24A]/25 motion-safe:animate-pulse"
              aria-hidden
            />
            <span className="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-b from-[#556B58] to-[#3D4F40] shadow-[0_10px_28px_rgba(61,79,64,0.28)]">
              <Icon name="check" size={28} className="text-[#F5EFE0]" />
            </span>
          </motion.div>

          <Typography
            variant="caption"
            className="relative mb-3 block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8A8278]"
          >
            {GLOBAL_CONFIG.brandName}
          </Typography>

          <Typography
            variant="h1"
            className="relative font-serif text-[2rem] font-normal leading-tight tracking-[0.02em] text-[#1A241C] md:text-[2.5rem]"
          >
            {copy.title}
          </Typography>

          <Typography
            variant="body"
            className="relative mt-3 text-[15px] font-medium leading-relaxed text-[#3A3A34] md:text-base"
          >
            {copy.subtitle}
          </Typography>

          <Typography
            variant="body"
            className="relative mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-[#6B635A] md:text-[15px]"
          >
            {copy.body}
          </Typography>

          <div className="relative mx-auto mt-9 max-w-sm text-left">
            <Typography
              variant="caption"
              className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A8278]"
            >
              {copy.stepsTitle}
            </Typography>

            <ol className="space-y-3">
              {copy.steps.map((step, index) => (
                <motion.li
                  key={step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.22 + index * 0.08,
                    ease,
                  }}
                  className="flex items-start gap-3 rounded-xl border border-[#E8E0D4]/90 bg-white/45 px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E8ECDF] font-sans text-[11px] font-semibold text-[#3D4F40]">
                    {index + 1}
                  </span>
                  <Typography
                    variant="body"
                    className="text-[14px] leading-snug text-[#2A2A24] md:text-[15px]"
                  >
                    {step}
                  </Typography>
                </motion.li>
              ))}
            </ol>
          </div>

          <div className="relative mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="fill"
              href={UI_CONFIG.routing.catalog.href}
              className="w-full min-w-[11rem] sm:w-auto"
            >
              {copy.catalogCta}
            </Button>
            <Button
              variant="outline"
              href={UI_CONFIG.routing.home.href}
              className="w-full min-w-[11rem] sm:w-auto"
            >
              {copy.homeCta}
            </Button>
          </div>

          <div className="relative mt-10 flex flex-col items-center gap-2 border-t border-[#E8E0D4]/90 pt-7">
            <Typography
              variant="caption"
              className="text-[12px] tracking-wide text-[#8A8278]"
            >
              {copy.phoneHint}
            </Typography>
            <HeroPhoneLink
              phone={GLOBAL_CONFIG.phone}
              className="static font-sans text-base font-semibold tracking-wide text-[#BC5434] md:text-lg"
              linkClassName="hover:text-[#a0482c]"
            />
          </div>

          <div
            className="relative mt-8 flex items-center justify-center gap-3 text-[#C4BBB0]"
            aria-hidden
          >
            <span className="h-px w-10 bg-current" />
            <Icon name="mountains" size={18} />
            <span className="h-px w-10 bg-current" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
