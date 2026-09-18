import type { Metadata } from "next";

import { CatalogSection } from "@/components/home/catalog-section";
import { EventsIntroSection } from "@/components/home/events-intro-section";
import { HeroSection } from "@/components/home/hero-section";
import { SiteFooter } from "@/components/ui/site-footer";
import { WeddingsIntroSection } from "@/components/home/weddings-intro-section";
import { WhySiestaSection } from "@/components/home/why-siesta-section";
import { SITE_SEO, absoluteAssetUrl, absoluteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: {
    absolute: SITE_SEO.titleDefault,
  },
  description: SITE_SEO.description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: SITE_SEO.titleDefault,
    description: SITE_SEO.description,
    url: absoluteUrl("/"),
    images: [
      {
        url: absoluteAssetUrl(SITE_SEO.ogImage),
        alt: `${SITE_SEO.brandName} — базы отдыха на Алтае`,
      },
    ],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />

      <div className="bg-[#FFFbf7]">
        <WhySiestaSection />
        <CatalogSection />
        <EventsIntroSection />
        <WeddingsIntroSection />
      </div>

      <SiteFooter />
    </main>
  );
}
