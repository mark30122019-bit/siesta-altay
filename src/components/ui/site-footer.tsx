import Link from "next/link";

import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import { cn } from "@/lib/utils";

export type SiteFooterProps = {
  tone?: "plain" | "chrome";
  className?: string;
};

const FOOTER_NAV = [
  {
    href: UI_CONFIG.routing.catalog.href,
    label: UI_CONFIG.routing.catalog.label,
  },
  {
    href: UI_CONFIG.routing.corporate.href,
    label: UI_CONFIG.routing.corporate.label,
  },
  {
    href: UI_CONFIG.routing.weddings.href,
    label: UI_CONFIG.routing.weddings.label,
  },
  {
    href: "/politika",
    label: UI_CONFIG.politika.footerLink,
  },
] as const;

export function SiteFooter({ tone = "chrome", className }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "w-full",
        tone === "chrome" && "site-chrome border-t",
        tone === "plain" && "border-t border-transparent bg-transparent",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto flex min-h-[140px] w-full flex-col items-center justify-center gap-4 px-6 py-8 text-center",
          "md:px-[10vw]"
        )}
      >
        <nav
          aria-label="Навигация"
          className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2"
        >
          {FOOTER_NAV.map((item, index) => (
            <span key={item.href} className="flex items-center gap-x-1">
              {index > 0 ? (
                <span
                  aria-hidden
                  className={cn(
                    "px-2 select-none",
                    tone === "chrome" ? "text-[#F5EFE0]/25" : "text-[#1A241C]/20"
                  )}
                >
                  ·
                </span>
              ) : null}
              <Link
                href={item.href}
                className={cn(
                  "font-sans text-sm tracking-wide transition-colors",
                  tone === "chrome"
                    ? "text-[#F5EFE0]/70 hover:text-[#D4A24A]"
                    : "text-[#6B635A] hover:text-[#BC5434]"
                )}
              >
                {item.label}
              </Link>
            </span>
          ))}
        </nav>

        <Typography
          variant="caption"
          className={cn(
            "text-base tracking-wide md:text-lg",
            tone === "chrome" ? "text-[#F5EFE0]/85" : "text-[#1A241C]"
          )}
        >
          <span>{GLOBAL_CONFIG.companyName}</span>{" "}
          <span
            className={
              tone === "chrome" ? "font-medium text-[#D4A24A]" : undefined
            }
          >
            {UI_CONFIG.common.copyright} {year}
          </span>
        </Typography>
      </div>
    </footer>
  );
}
