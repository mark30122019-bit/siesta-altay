import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200/80 py-10 text-center">
      <Typography variant="caption" className="text-stone-400">
        {GLOBAL_CONFIG.companyName} {UI_CONFIG.common.copyright} {year}
      </Typography>
    </footer>
  );
}
