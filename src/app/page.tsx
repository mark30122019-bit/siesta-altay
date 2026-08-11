import { CatalogSection } from "@/components/home/catalog-section";
import { CultureSection } from "@/components/home/culture-section";
import { ExpeditionSection } from "@/components/home/expedition-section";
import { HeroSection } from "@/components/home/hero-section";
import { SiteFooter } from "@/components/home/site-footer";
import { WhySiestaSection } from "@/components/home/why-siesta-section";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />

      {/*
        Две колонки (как на макете):
        слева  — Почему Сиеста → Экспедиция (список сразу над карточкой)
        справа — Каталог → Культура
      */}
      <section className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 px-6 py-14 md:gap-12 lg:grid-cols-2 lg:gap-x-14 lg:px-10 lg:py-16 xl:px-12">
        <div className="flex flex-col justify-between gap-12 md:gap-[3.75rem]">
          <WhySiestaSection />
          <ExpeditionSection />
        </div>

        <div className="flex flex-col gap-10 md:gap-12">
          <CatalogSection />
          <CultureSection />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
