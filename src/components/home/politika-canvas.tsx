import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { POLITIKA_SECTIONS } from "@/config/politikaContent";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import { HeroPhoneLink } from "@/components/home/hero-phone-link";

export function PolitikaCanvas() {
  const copy = UI_CONFIG.politika;

  return (
    <section className="relative flex-1 px-6 py-12 md:px-[10vw] md:py-16">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -left-[10%] top-[4%] size-[24rem] rounded-full bg-[#E8ECDF]/45 blur-3xl" />
        <div className="absolute -right-[8%] top-[30%] size-[22rem] rounded-full bg-[#F8E9E4]/35 blur-3xl" />
      </div>

      <article className="surface-card relative mx-auto max-w-3xl overflow-hidden rounded-[1.75rem] px-6 py-10 md:px-12 md:py-14">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4A24A]/50 to-transparent"
          aria-hidden
        />

        <header className="mb-10 border-b border-[#E8E0D4] pb-8 text-center md:mb-12 md:pb-10">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full border border-[#E8E0D4] bg-[#E8ECDF]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <Icon name="check" size={24} className="text-[#3D4F40]" />
          </div>

          <Typography
            variant="caption"
            className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A8278]"
          >
            {GLOBAL_CONFIG.brandName}
          </Typography>

          <Typography
            variant="h1"
            className="font-serif text-[1.85rem] font-normal leading-tight tracking-[0.02em] text-[#1A241C] md:text-[2.35rem]"
          >
            {copy.title}
          </Typography>

          <Typography
            variant="caption"
            className="mt-3 block text-[13px] text-[#8A8278]"
          >
            {copy.updatedLabel}: {copy.updatedAt}
          </Typography>

          <Typography
            variant="body"
            className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-[#6B635A] md:text-base"
          >
            {copy.intro}
          </Typography>
        </header>

        <nav
          aria-label="Оглавление"
          className="mb-10 rounded-2xl border border-[#E8E0D4]/90 bg-white/40 px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] md:mb-12"
        >
          <Typography
            variant="caption"
            className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A8278]"
          >
            Содержание
          </Typography>
          <ol className="grid gap-2 sm:grid-cols-2">
            {POLITIKA_SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="font-sans text-[13px] leading-snug text-[#3A3A34] transition-colors hover:text-[#BC5434] md:text-[14px]"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-9 md:space-y-11">
          {POLITIKA_SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28"
            >
              <Typography
                variant="h2"
                className="mb-3 font-sans text-lg font-semibold tracking-wide text-[#1A241C] md:text-xl"
              >
                {section.title}
              </Typography>

              <div className="space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <Typography
                    key={paragraph}
                    variant="body"
                    className="text-[14px] leading-relaxed text-[#4A463E] md:text-[15px]"
                  >
                    {paragraph}
                  </Typography>
                ))}
              </div>

              {section.list ? (
                <ul className="mt-3 space-y-2 pl-1">
                  {section.list.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-[#5c6b3a]/70"
                        aria-hidden
                      />
                      <Typography
                        variant="body"
                        className="text-[14px] leading-relaxed text-[#4A463E] md:text-[15px]"
                      >
                        {item}
                      </Typography>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <footer className="mt-12 border-t border-[#E8E0D4] pt-8 text-center">
          <Typography
            variant="caption"
            className="mb-2 block text-[12px] tracking-wide text-[#8A8278]"
          >
            {GLOBAL_CONFIG.companyName}
          </Typography>
          <HeroPhoneLink
            phone={GLOBAL_CONFIG.phone}
            className="static font-sans text-base font-semibold tracking-wide text-[#BC5434] md:text-lg"
            linkClassName="hover:text-[#a0482c]"
          />

          <div
            className="mt-8 flex items-center justify-center gap-3 text-[#C4BBB0]"
            aria-hidden
          >
            <span className="h-px w-10 bg-current" />
            <Icon name="mountains" size={18} />
            <span className="h-px w-10 bg-current" />
          </div>
        </footer>
      </article>
    </section>
  );
}
