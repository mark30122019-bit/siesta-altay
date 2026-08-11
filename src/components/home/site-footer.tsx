import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--chrome-border)] bg-[var(--chrome)]">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-[100px] pt-8 text-right lg:px-10 xl:px-12">
        <Typography variant="caption" className="text-xl text-[#1A241C]">
          {GLOBAL_CONFIG.companyName} {UI_CONFIG.common.copyright} {year}
        </Typography>
      </div>
    </footer>
  );
}
