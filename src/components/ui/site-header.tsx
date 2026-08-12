"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { HeroPhoneLink } from "@/components/home/hero-phone-link";
import { GLOBAL_CONFIG } from "@/config/global";
import { cn } from "@/lib/utils";

const DESKTOP_INSET = "md:px-[10vw]";

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
  const isHiddenRef = useRef(isHidden);
  const lastScrollYRef = useRef<number>(0);
  const accumulatedDownRef = useRef<number>(0);
  const accumulatedUpRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    isHiddenRef.current = isHidden;
  }, [isHidden]);

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
          accumulatedUpRef.current = 0;
          lastScrollYRef.current = currentY;
          return;
        }

        // Анти-дерганье:
        // - вниз копим расстояние до скрытия
        // - вверх копим до показа (микрошаги вверх не вернут header мгновенно)
        const START_HIDE_AFTER_PX = 40;
        const SHOW_AFTER_UP_PX = 14;
        // Показываем header только в верхней зоне страницы,
        // чтобы он не "вылезал" в середине из-за микродвижений/инерции.
        const SHOW_ONLY_NEAR_TOP_PX = 160;
        const isNearTop = currentY <= SHOW_ONLY_NEAR_TOP_PX;

        // Дополнительно: при приближении к футеру точно скрываем,
        // но обратно показываем ТОЛЬКО по порогу вверх.
        const footerEl = document.querySelector("footer");
        const footerTop = footerEl
          ? footerEl.getBoundingClientRect().top + currentY
          : null;
        const FOOTER_HIDE_MARGIN_PX = 26;
        const isNearFooter =
          footerTop !== null
            ? currentY + window.innerHeight >=
              footerTop - FOOTER_HIDE_MARGIN_PX
            : false;

        if (delta > 0) {
          accumulatedDownRef.current += delta;
          accumulatedUpRef.current = 0;

          const shouldHide =
            accumulatedDownRef.current >= START_HIDE_AFTER_PX || isNearFooter;

          if (shouldHide && !isHiddenRef.current) setIsHidden(true);
        } else if (delta < 0) {
          accumulatedUpRef.current += Math.abs(delta);
          accumulatedDownRef.current = 0;

          if (
            isNearTop &&
            accumulatedUpRef.current >= SHOW_AFTER_UP_PX &&
            isHiddenRef.current
          ) {
            setIsHidden(false);
          }
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
        "site-chrome sticky top-0 z-50 w-full border-b border-white/15 backdrop-blur-lg transform-gpu transition-[opacity,transform] duration-500 ease-out",
        isHidden
          ? "-translate-y-0 opacity-0 pointer-events-none"
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
