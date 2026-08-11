import { CatalogSection } from "@/components/home/catalog-section";
import { CultureSection } from "@/components/home/culture-section";
import { HeroSection } from "@/components/home/hero-section";
import { SiteFooter } from "@/components/home/site-footer";
import { WhySiestaSection } from "@/components/home/why-siesta-section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FBFBFA]">
      <HeroSection />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-14 lg:py-16">
        <WhySiestaSection />
        <CatalogSection />
      </section>

      <CultureSection />
      <SiteFooter />
    </main>
  );
}
