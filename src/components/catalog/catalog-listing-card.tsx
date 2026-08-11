import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Icon, type IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { UI_CONFIG } from "@/config/uiConfig";
import type { BaseObject } from "@/types";
import { cn } from "@/lib/utils";

const AMENITY_ICONS: {
  key: keyof BaseObject["amenities"];
  icon: IconName;
  label: string;
}[] = [
  { key: "banya", icon: "bath", label: UI_CONFIG.base.amenityLabels.banya },
  { key: "pool", icon: "pool", label: UI_CONFIG.base.amenityLabels.pool },
  { key: "wifi", icon: "wifi", label: UI_CONFIG.base.amenityLabels.wifi },
  {
    key: "waterfront",
    icon: "water",
    label: UI_CONFIG.base.amenityLabels.waterfront,
  },
  {
    key: "heating",
    icon: "fog",
    label: UI_CONFIG.base.amenityLabels.heating,
  },
  {
    key: "year_round",
    icon: "mountains",
    label: UI_CONFIG.base.amenityLabels.year_round,
  },
  { key: "pets", icon: "tree", label: UI_CONFIG.base.amenityLabels.pets },
];

function coverSrc(object: BaseObject) {
  return object.tour.preview || object.photos[0]?.src || "";
}

export function CatalogListingCard({
  object,
  className,
}: {
  object: BaseObject;
  className?: string;
}) {
  const src = coverSrc(object);
  const hasTour = Boolean(object.tour?.url);
  const amenities = AMENITY_ICONS.filter(
    (item) => object.amenities[item.key] === true
  ).slice(0, 5);
  const notFor =
    object.author.not_for[0] || object.suitability.family_kids.note;
  const href = `/base/${object.slug}`;

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-stone-200/90 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)]",
        className
      )}
    >
      <Link href={href} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={object.name}
              className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
            />
          ) : (
            <div
              className="h-full w-full bg-[linear-gradient(145deg,#c5bfb2_0%,#8a9a8e_50%,#5c6b6e_100%)]"
              aria-hidden
            />
          )}
          {hasTour ? (
            <Badge
              variant="tour"
              text={UI_CONFIG.home.tourBadge}
              className="absolute bottom-2.5 right-2.5 z-10"
            />
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3">
        <Link href={href} className="block">
          <Typography
            variant="h3"
            className="font-serif text-base font-normal leading-snug tracking-wide text-[#1A241C] md:text-[17px]"
          >
            {object.name}
          </Typography>
          <Typography
            variant="caption"
            className="mt-1 block text-[11px] text-[#888]"
          >
            {object.location.district}
          </Typography>
        </Link>

        <Typography
          variant="body"
          className="mt-2.5 text-sm font-semibold text-[#1A241C]"
        >
          {`${UI_CONFIG.base.pricePrefix} ${object.price.from.toLocaleString("ru-RU")} ₽/${object.price.unit}`}
        </Typography>

        {amenities.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2.5 border-t border-stone-100 pt-3">
            {amenities.map((item) => (
              <div
                key={item.key}
                className="flex flex-col items-center gap-1.5 text-stone-400"
              >
                <Icon name={item.icon} size={22} />
                <span className="font-sans text-[11px] leading-none text-stone-400">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-3 border-t border-stone-100 pt-3">
          <Typography
            variant="caption"
            className="mb-1 block text-[11px] font-semibold text-[#BC5434]"
          >
            {UI_CONFIG.catalog.notForLabel}
          </Typography>
          <Typography
            variant="body"
            className="line-clamp-3 text-[12px] leading-relaxed text-[#555]"
          >
            {notFor}
          </Typography>
        </div>

        <div className="mt-auto pt-4">
          <Link
            href={href}
            className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-[#BC5434] px-3 font-sans text-xs font-semibold tracking-wide text-white transition-colors hover:bg-[#a0482c]"
          >
            {UI_CONFIG.home.bookCta}
          </Link>
        </div>
      </div>
    </article>
  );
}
