import Link from "next/link";

import { Typography } from "@/components/ui/typography";
import { CatalogCard } from "@/components/home/catalog-card";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import type { BaseObject } from "@/types";

export function CatalogSection() {
  const objects = GLOBAL_CONFIG.objects.filter(
    (object) => object.status === "published"
  );
  const preferred = UI_CONFIG.home.featuredSlugs
    .map((slug) => objects.find((object) => object.slug === slug))
    .filter((object): object is BaseObject => Boolean(object));
  const featured = preferred.length >= 2 ? preferred : objects.slice(0, 2);

  const featuredSlugs = new Set(featured.map((object) => object.slug));
  const shortCards = objects
    .filter((object) => !featuredSlugs.has(object.slug))
    .slice(0, 3);

  while (shortCards.length < 3 && objects.length > 0) {
    shortCards.push(objects[shortCards.length % objects.length]);
  }

  return (
    <div id="catalog" className="scroll-mt-8">
      <Link href={UI_CONFIG.home.catalogHref} className="mb-4 inline-block">
        <Typography
          variant="h2"
          className="text-xl font-bold text-[#1A241C] transition-colors hover:text-[#BC5434] md:text-2xl"
        >
          {UI_CONFIG.home.catalogTitle}
        </Typography>
      </Link>

      <div className="grid grid-cols-2 gap-3">
        {featured.map((object) => (
          <CatalogCard key={object.slug} object={object} variant="default" />
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {shortCards.map((object, index) => (
          <CatalogCard
            key={`short-${object.slug}-${index}`}
            object={object}
            variant="short"
          />
        ))}
      </div>
    </div>
  );
}
