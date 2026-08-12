import { CatalogCanvas } from "@/components/catalog/catalog-canvas";
import { SiteFooter, SiteHeader } from "@/components/ui";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";

export const metadata = {
  title: UI_CONFIG.home.catalogTitle,
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
      <CatalogCanvas objects={objects} />
      <SiteFooter />
    </main>
  );
}
