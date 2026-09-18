import type { Metadata } from "next";

import { CorporateCanvas } from "@/components/corporate/corporate-canvas";
import { SiteFooter, SiteHeader } from "@/components/ui";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import { absoluteUrl } from "@/config/site";
import { isObjectListedForEvents } from "@/lib/object-events";

const description = UI_CONFIG.corporate.subtitle;

export const metadata: Metadata = {
  title: UI_CONFIG.corporate.title,
  description,
  alternates: {
    canonical: absoluteUrl(UI_CONFIG.routing.corporate.href),
  },
  openGraph: {
    title: `${UI_CONFIG.corporate.title} | Алтай изнутри`,
    description,
    url: absoluteUrl(UI_CONFIG.routing.corporate.href),
  },
};

export default function CorporatePage() {
  const objects = GLOBAL_CONFIG.objects.filter(isObjectListedForEvents);

  return (
    <main className="min-h-screen bg-[#F4F0E8]">
      <SiteHeader
        showNav
        activeNav="corporate"
        backHref={UI_CONFIG.routing.home.href}
        backLabel={UI_CONFIG.routing.home.backLabel}
      />
      <CorporateCanvas objects={objects} />
      <SiteFooter />
    </main>
  );
}
