import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { assetPath } from "@/config/site";

export function ExpeditionSection() {
  const { promoTour } = GLOBAL_CONFIG;

  return (
    <Card className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border-0 p-0 shadow-none md:aspect-[2/1]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={assetPath(promoTour.image)}
        alt={promoTour.title}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10"
        aria-hidden
      />

      {/* Единая внутренняя граница для текста и бейджа */}
      <div className="absolute inset-5 flex flex-col justify-between md:inset-8">
        <div className="flex justify-end">
          <Badge
            variant="action"
            text={promoTour.badge}
            className="hidden rounded-none bg-transparent px-0 py-0 text-right text-[11px] font-medium leading-tight tracking-wide text-white shadow-none sm:inline-flex md:text-xs"
          />
        </div>

        <div className="max-w-xl">
          <Typography
            variant="h3"
            className="mb-2 text-xl font-semibold text-white md:text-2xl lg:text-3xl"
          >
            {promoTour.title}
          </Typography>
          <Typography
            variant="body"
            className="max-w-md text-sm leading-relaxed text-white/90 md:text-base"
          >
            {promoTour.description}
          </Typography>
        </div>
      </div>
    </Card>
  );
}
