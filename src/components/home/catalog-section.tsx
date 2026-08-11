import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import type { BaseObject } from "@/types";
import { cn } from "@/lib/utils";

function formatPrice(object: BaseObject) {
  return `${UI_CONFIG.base.pricePrefix} ${object.price.from.toLocaleString("ru-RU")} ₽/${object.price.unit}`;
}

function BaseCard({ object }: { object: BaseObject }) {
  const cover = object.photos[0];

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        <div
          className="absolute inset-0 bg-[linear-gradient(145deg,#c5bfb2_0%,#8a9a8e_50%,#5c6b6e_100%)]"
          aria-hidden
        />
        {cover ? <span className="sr-only">{cover.alt}</span> : null}
        {object.tour?.url ? (
          <Badge
            variant="tour"
            text={UI_CONFIG.home.tourBadge}
            className="absolute bottom-3 right-3 z-10"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Typography variant="h3" className="mb-2">
          {object.name}
        </Typography>
        <Typography variant="body" className="mb-4 line-clamp-2 text-stone-600">
          {object.author.verdict}
        </Typography>
        <Typography
          variant="caption"
          className="mb-4 block font-semibold text-[#1A241C]"
        >
          {formatPrice(object)}
        </Typography>
        <Button
          variant="outline"
          href={`/base/${object.slug}`}
          className="mt-auto w-full bg-[#BC5434] text-white hover:bg-[#a0482c] hover:text-white"
        >
          {UI_CONFIG.home.bookCta}
        </Button>
      </div>
    </Card>
  );
}

export function CatalogSection() {
  const objects = GLOBAL_CONFIG.objects.filter(
    (object) => object.status === "published"
  );
  const preferred = UI_CONFIG.home.featuredSlugs
    .map((slug) => objects.find((object) => object.slug === slug))
    .filter((object): object is BaseObject => Boolean(object));
  const featured = preferred.length >= 2 ? preferred : objects.slice(0, 2);
  const thumbs = objects.flatMap((object) => object.photos).slice(0, 3);

  while (thumbs.length < 3) {
    thumbs.push({
      src: "",
      alt: UI_CONFIG.home.thumbAltFallback,
      caption: "",
    });
  }

  return (
    <div id="catalog" className="scroll-mt-8">
      <Typography variant="h2" className="mb-6">
        {UI_CONFIG.home.catalogTitle}
      </Typography>

      <div className="grid gap-5 sm:grid-cols-2">
        {featured.map((object) => (
          <BaseCard key={object.slug} object={object} />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {thumbs.map((photo, index) => (
          <Card
            key={`${photo.src}-${index}`}
            className="relative aspect-[5/3] overflow-hidden rounded-lg border-0 p-0 shadow-none"
          >
            <div
              className={cn(
                "absolute inset-0",
                index === 0 &&
                  "bg-[linear-gradient(160deg,#9aa89a,#6d7a6e)]",
                index === 1 &&
                  "bg-[linear-gradient(160deg,#b8aea0,#7d8a92)]",
                index === 2 &&
                  "bg-[linear-gradient(160deg,#a89888,#5e6a62)]"
              )}
              aria-hidden
            />
            <span className="sr-only">{photo.alt}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}
