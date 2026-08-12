import Link from "next/link";

import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import { cn } from "@/lib/utils";

export type SiteFooterProps = {
  tone?: "plain" | "chrome";
  /** Опциональная ссылка слева (десктоп), напр. «В каталог» */
  sideLink?: { href: string; label: string };
  className?: string;
};

export function SiteFooter({
  tone = "chrome",
  sideLink,
  className,
}: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "w-full",
        tone === "chrome" && "border-t border-[#2e4d34] bg-[#2e4d34]",
        tone === "plain" && "border-t border-transparent bg-transparent",
        className
      )}
    >
      <div
        className={cn(
          "relative mx-auto flex min-h-[140px] w-full items-center justify-center px-6 py-6 text-center",
          sideLink ? "md:px-[15vw]" : "max-w-[1440px] lg:px-10 xl:px-12"
        )}
      >
        {sideLink ? (
          <Link
            href={sideLink.href}
            className="absolute left-6 top-1/2 hidden -translate-y-1/2 font-sans text-sm font-medium tracking-wide text-[#F5EFE0]/80 transition-colors hover:text-[#D4A24A] md:left-[15vw] md:inline md:text-base"
          >
            {sideLink.label}
          </Link>
        ) : null}

        <Typography
          variant="caption"
          className={cn(
            "text-xl tracking-wide",
            tone === "chrome" ? "text-[#F5EFE0]" : "text-[#1A241C]"
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
