"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import { cn } from "@/lib/utils";

const DESKTOP_INSET = "md:px-[10vw]";

export type SiteHeaderNavId = "catalog" | "corporate";

export type SiteHeaderProps = {
  className?: string;
  /** Режим «назад» (страница базы, политика и т.п.) */
  backHref?: string;
  backLabel?: string;
  /**
   * Обычная навигация: Каталог + Мероприятия под брендом
   * (каталог / мероприятия).
   */
  showNav?: boolean;
  activeNav?: SiteHeaderNavId;
};

const NAV_ITEMS: { id: SiteHeaderNavId; href: string; label: string }[] = [
  {
    id: "catalog",
    href: UI_CONFIG.routing.catalog.href,
    label: UI_CONFIG.routing.catalog.label,
  },
  {
    id: "corporate",
    href: UI_CONFIG.routing.corporate.href,
    label: UI_CONFIG.routing.corporate.label,
  },
];

export function SiteHeader({
  backHref,
  backLabel,
  className,
  showNav = false,
  activeNav,
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

        const START_HIDE_AFTER_PX = 40;
        const SHOW_AFTER_UP_PX = 14;
        const SHOW_ONLY_NEAR_TOP_PX = 160;
        const isNearTop = currentY <= SHOW_ONLY_NEAR_TOP_PX;

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
          "mx-auto flex w-full items-center px-6 py-5 md:py-6",
          DESKTOP_INSET
        )}
      >
        <div className="flex min-w-0 flex-col gap-2.5">
          <Link
            href="/"
            className="cursor-pointer font-serif text-lg font-normal tracking-[0.06em] text-[#F5EFE0] transition-colors hover:text-white md:text-xl"
          >
            {GLOBAL_CONFIG.brandName}
          </Link>

          {(backHref && backLabel) || showNav ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {backHref && backLabel ? (
                <Button
                  variant="ghost"
                  href={backHref}
                  className="w-fit px-0 py-0 font-sans text-[13px] font-medium tracking-wide text-white/80 hover:bg-transparent hover:text-white md:text-sm"
                >
                  {backLabel}
                </Button>
              ) : null}

              {showNav ? (
                <>
                  {backHref && backLabel ? (
                    <span
                      aria-hidden
                      className="hidden h-3 w-px bg-white/25 sm:block"
                    />
                  ) : null}
                  <nav
                    aria-label="Разделы сайта"
                    className="flex flex-wrap items-center gap-x-4 gap-y-1"
                  >
                    {NAV_ITEMS.map((item) => {
                      const active = activeNav === item.id;
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "font-sans text-[13px] font-medium tracking-wide transition-colors md:text-sm",
                            active
                              ? "text-white"
                              : "text-white/70 hover:text-white"
                          )}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
