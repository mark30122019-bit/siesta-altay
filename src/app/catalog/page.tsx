import { CatalogCanvas } from "@/components/catalog/catalog-canvas";
import { CatalogHeader } from "@/components/catalog/catalog-header";
import { SiteFooter } from "@/components/home/site-footer";
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
      <CatalogHeader />
      <CatalogCanvas objects={objects} />
      <SiteFooter tone="paper" />
    </main>
  );
}
