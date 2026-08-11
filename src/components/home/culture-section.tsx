import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config";

export function CultureSection() {
  const { testimonials } = GLOBAL_CONFIG;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3">
          <Icon name="mountains" size={28} className="text-[#4A5D4E]" />
          <Typography variant="h2" className="uppercase tracking-wide">
            Культура сибирского релакса
          </Typography>
        </div>
        <Typography variant="caption" className="max-w-sm md:text-right">
          Наши эксперты дают советы по выбору места отдыха.{" "}
          <span className="text-[#1A241C]">Подробнее ›</span>
        </Typography>
      </div>

      <div className="grid gap-8 md:grid-cols-3 md:divide-x md:divide-stone-200 md:gap-0">
        {testimonials.map((item) => (
          <article
            key={item.baseName}
            className="md:px-8 first:md:pl-0 last:md:pr-0"
          >
            <Icon name="quote" size={28} className="mb-4 text-stone-300" />
            <Typography variant="lead" className="mb-5 min-h-[4.5rem]">
              {item.quote}
            </Typography>
            <div className="mb-2 flex gap-0.5 text-[#BC5434]">
              {Array.from({ length: item.rating }).map((_, starIndex) => (
                <Icon key={starIndex} name="star" size={16} />
              ))}
            </div>
            <Typography variant="caption" className="text-stone-600">
              {item.baseName}
            </Typography>
          </article>
        ))}
      </div>
    </section>
  );
}
