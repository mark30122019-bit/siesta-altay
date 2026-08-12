"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef<number>(0);
  const accumulatedDownRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY || 0;

    function onScroll() {
      if (rafRef.current) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;

        const currentY = window.scrollY || 0;
        const prevY = lastScrollYRef.current;
        const delta = currentY - prevY;

        if (currentY < 8) {
          setIsHidden(false);
          accumulatedDownRef.current = 0;
          lastScrollYRef.current = currentY;
          return;
        }

        // Прячем очень аккуратно: как только пользователь “заехал” вниз на ~20-40px.
        const START_HIDE_AFTER_PX = 50;

        if (delta > 0) {
          accumulatedDownRef.current += delta;

          // Если пользователь быстро едет вниз — прячем раньше накопленного порога тоже.
          const QUICK_FALLBACK_PX = 100;
          const shouldHide =
            accumulatedDownRef.current >= START_HIDE_AFTER_PX ||
            delta >= QUICK_FALLBACK_PX;

          // Дополнительно: при приближении к футеру точно скрываем.
          const footerEl = document.querySelector("footer");
          const footerTop = footerEl
            ? footerEl.getBoundingClientRect().top + currentY
            : null;
          const FOOTER_HIDE_MARGIN_PX = 24;
          const isNearFooter =
            footerTop !== null
              ? currentY + window.innerHeight >=
                footerTop - FOOTER_HIDE_MARGIN_PX
              : false;

          setIsHidden(shouldHide || isNearFooter);
        } else if (delta < 0) {
          // При любом ощутимом подъёме показываем обратно (для UX переключения фильтра).
          accumulatedDownRef.current = 0;
          setIsHidden(false);
        } else {
          // delta === 0: не трогаем
        }

        lastScrollYRef.current = currentY;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <header
      className={cn(
        "site-chrome sticky top-0 z-50 w-full border-b border-white/15 backdrop-blur-lg transform-gpu transition-[transform,opacity] ease-out",
        // Fade-out дольше, fade-in короче (быстро “выплывает”, когда чуть скроллянул вверх).
        isHidden ? "duration-[2000ms]" : "duration-250",
        isHidden
          ? "-translate-y-full opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100",
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
