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
    <main className="min-h-screen bg-[#0E1210]">
      <SiteHeader
        backHref={UI_CONFIG.routing.home.href}
        backLabel={UI_CONFIG.routing.home.backLabel}
        className="border-b border-white/10 bg-[#0E1210]/85"
        hideCorporateLink
      />
      <CorporateCanvas objects={objects} />
      <SiteFooter
        sideLink={{
          href: UI_CONFIG.routing.catalog.href,
          label: UI_CONFIG.routing.catalog.ctaLabel,
        }}
      />
    </main>
  );
}
