import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import { cn } from "@/lib/utils";

type SiteFooterProps = {
  /** plain — без фона/бордера (главная); paper — #f8f8f0 */
  tone?: "plain" | "paper";
};

export function SiteFooter({ tone = "paper" }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "w-full",
        tone === "paper" && "border-t border-[#f8f8f0] bg-[#f8f8f0]",
        tone === "plain" && "border-t border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex min-h-[140px] w-full max-w-[1440px] items-center justify-center px-6 py-10 text-center lg:px-10 xl:px-12">
        <Typography variant="caption" className="text-xl text-[#1A241C]">
          {GLOBAL_CONFIG.companyName} {UI_CONFIG.common.copyright} {year}
        </Typography>
      </div>
    </footer>
  );
}
