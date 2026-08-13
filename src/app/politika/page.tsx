import type { Metadata } from "next";

import { PolitikaCanvas } from "@/components/home/politika-canvas";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { absoluteUrl } from "@/config/site";
import { UI_CONFIG } from "@/config/uiConfig";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Политика конфиденциальности сайта «Алтай изнутри» — обработка персональных данных при бронировании баз отдыха.",
  alternates: {
    canonical: absoluteUrl("/politika"),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PolitikaPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F4F0E8]">
      <SiteHeader
        backHref={UI_CONFIG.routing.home.href}
        backLabel={UI_CONFIG.politika.backLabel}
      />
      <PolitikaCanvas />
      <SiteFooter
        sideLink={{
          href: UI_CONFIG.routing.home.href,
          label: UI_CONFIG.routing.home.label,
        }}
      />
    </main>
  );
}
