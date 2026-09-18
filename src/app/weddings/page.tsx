import type { Metadata } from "next";

import { EventsCatalogCanvas } from "@/components/events/events-catalog-canvas";
import { SiteFooter, SiteHeader } from "@/components/ui";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import { absoluteUrl } from "@/config/site";
import { isObjectListedForWeddings } from "@/lib/object-events";

const description = UI_CONFIG.weddings.subtitle;

export const metadata: Metadata = {
  title: UI_CONFIG.weddings.title,
  description,
  alternates: {
    canonical: absoluteUrl(UI_CONFIG.routing.weddings.href),
  },
  openGraph: {
    title: `${UI_CONFIG.weddings.title} | Алтай изнутри`,
    description,
    url: absoluteUrl(UI_CONFIG.routing.weddings.href),
  },
};

export default function WeddingsPage() {
  const objects = GLOBAL_CONFIG.objects.filter(isObjectListedForWeddings);

  return (
    <main className="min-h-screen bg-[#F4F0E8]">
      <SiteHeader
        showNav
        activeNav="weddings"
        backHref={UI_CONFIG.routing.home.href}
        backLabel={UI_CONFIG.routing.home.backLabel}
      />
      <EventsCatalogCanvas objects={objects} variant="weddings" />
      <SiteFooter />
    </main>
  );
}
