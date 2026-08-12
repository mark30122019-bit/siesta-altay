import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";

function QuoteDivider() {
  return (
    <span className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 bg-[#f8f8f0] px-2">
      <span className="flex size-8 items-center justify-center rounded-full bg-[#E4DBD4]">
        <Icon name="quote" size={16} className="text-[#f1ece5]" />
      </span>
    </span>
  );
}

export function CultureSection() {
  const { testimonials } = GLOBAL_CONFIG;

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <Icon name="mountains" size={22} className="text-[#3A3A34]" />
          <Typography
            variant="h2"
            className="text-lg font-bold uppercase tracking-[0.04em] text-[#1A241C] md:text-xl"
          >
            {UI_CONFIG.home.cultureTitle}
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3">
        {testimonials.map((item) => (
          <Card
            key={item.baseName}
            className="relative flex min-h-[200px] flex-col items-center rounded-lg border border-[#E8E0D4]/90 bg-[#f8f8f0] px-3 pb-4 pt-8 text-center shadow-none"
          >
            <QuoteDivider />

            <Typography
              variant="body"
              className="mb-3 text-sm font-medium leading-snug text-[#333]"
            >
              {item.quote}
            </Typography>

            <div className="flex justify-center gap-0.5 text-[#D4A017]">
              {Array.from({ length: item.rating }).map((_, starIndex) => (
                <Icon key={starIndex} name="star" size={24} />
              ))}
            </div>

            <Typography
              variant="caption"
              className="mt-4 text-xs font-medium text-stone-500"
            >
              {item.baseName}
            </Typography>
          </Card>
        ))}
      </div>
    </div>
  );
}
