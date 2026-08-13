import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogCanvas } from "@/components/catalog/catalog-canvas";
import { SiteFooter, SiteHeader } from "@/components/ui";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import { absoluteUrl } from "@/config/site";

const catalogDescription =
  "Каталог проверенных баз отдыха на Алтае: фильтры по району, удобствам и цене, карта объектов и честные 3D-туры изнутри.";

export const metadata: Metadata = {
  title: UI_CONFIG.home.catalogTitle,
  description: catalogDescription,
  alternates: {
    canonical: absoluteUrl("/catalog"),
  },
  openGraph: {
    title: `${UI_CONFIG.home.catalogTitle} | Алтай изнутри`,
    description: catalogDescription,
    url: absoluteUrl("/catalog"),
  },
};

export default function CatalogPage() {
  const objects = GLOBAL_CONFIG.objects.filter(
    (object) => object.status === "published"
  );

  return (
    <main className="min-h-screen bg-[#F4F0E8]">
      <SiteHeader
        backHref={UI_CONFIG.routing.home.href}
        backLabel={UI_CONFIG.routing.home.backLabel}
      />
      <Suspense fallback={<div className="min-h-[50vh]" aria-hidden />}>
        <CatalogCanvas objects={objects} />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
