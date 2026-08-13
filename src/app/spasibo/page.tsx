import type { Metadata } from "next";

import { SpasiboCanvas } from "@/components/home/spasibo-canvas";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { UI_CONFIG } from "@/config/uiConfig";

export const metadata: Metadata = {
  title: "Заявка отправлена",
  description: "Спасибо за заявку. Менеджер ООО «Сиеста Центр» свяжется с вами.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SpasiboPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F4F0E8]">
      <SiteHeader
        backHref={UI_CONFIG.routing.catalog.href}
        backLabel={UI_CONFIG.routing.catalog.backLabel}
      />
      <SpasiboCanvas />
      <SiteFooter
        sideLink={{
          href: UI_CONFIG.routing.catalog.href,
          label: UI_CONFIG.routing.catalog.ctaLabel,
        }}
      />
    </main>
  );
}
