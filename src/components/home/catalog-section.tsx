import Link from "next/link";

import { CatalogCard } from "@/components/home/catalog-card";
import { CultureSection } from "@/components/home/culture-section";
import { EditorialBand } from "@/components/home/editorial-band";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import { isObjectListed } from "@/lib/object-flags";
import type { BaseObject } from "@/types";

export function CatalogSection() {
  const objects = GLOBAL_CONFIG.objects.filter(isObjectListed);
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
    <EditorialBand
      id="catalog"
      reverse
      text={
        <div className="flex flex-col gap-10 md:gap-12">
          <div>
            <Link
              href={UI_CONFIG.routing.catalog.href}
              className="mb-5 inline-block"
            >
              <Typography
                variant="h2"
                className="font-serif text-3xl font-normal leading-[1.15] tracking-wide text-[#1A241C] transition-colors hover:text-[#BC5434] md:text-4xl lg:text-[2.75rem]"
              >
                {UI_CONFIG.home.catalogTitle}
              </Typography>
            </Link>
            <Typography
              variant="body"
              className="max-w-md text-sm leading-[1.7] text-[#555] md:text-[15px]"
            >
              Базы с честным 3D-туром — смотрите территорию и дома до поездки.
            </Typography>
          </div>

          <CultureSection />
        </div>
      }
      visual={
        <div>
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
          <Link
            href={UI_CONFIG.routing.catalog.href}
            className="mt-5 inline-flex justify-center mt-2 gap-1.5 font-sans text-[16px] font-semibold tracking-wide text-[#BC5434] transition-colors hover:text-[#a8482c]"
          >
            {UI_CONFIG.routing.catalog.ctaLabel}
            <span aria-hidden>›</span>
          </Link>
        </div>
      }
    />
  );
}
