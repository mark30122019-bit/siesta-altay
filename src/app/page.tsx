import { CatalogSection } from "@/components/home/catalog-section";
import { CultureSection } from "@/components/home/culture-section";
import { ExpeditionSection } from "@/components/home/expedition-section";
import { HeroSection } from "@/components/home/hero-section";
import { SiteFooter } from "@/components/ui/site-footer";
import { WhySiestaSection } from "@/components/home/why-siesta-section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />

      {/*
        Две колонки (как на макете):
        слева  — Почему Сиеста → Экспедиция (список сразу над карточкой)
        справа — Каталог → Культура
      */}
      <section className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 bg-[#FFFbf7] px-6 pt-14 pb-[29vh] md:gap-12 lg:grid-cols-2 lg:gap-x-14 lg:px-10 lg:pt-16 lg:pb-[20vh] xl:px-12">
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
