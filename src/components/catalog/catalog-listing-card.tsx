"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";

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
  mode = "list",
}: {
  object: BaseObject;
  className?: string;
  mode?: "list" | "map";
}) {
  const src = coverSrc(object);
  const hasTour = Boolean(object.tour?.url);
  const [tourOpen, setTourOpen] = useState(false);
  const amenities = AMENITY_ICONS.filter(
    (item) => object.amenities[item.key] === true
  ).slice(0, 5);
  const notFor =
    object.author.not_for[0] || object.suitability.family_kids.note;
  const href = `/base/${object.slug}`;
  const isMap = mode === "map";

  function handleTourClick(event: MouseEvent) {
    if (!isMap || !hasTour) return;
    event.preventDefault();
    event.stopPropagation();
    setTourOpen((prev) => !prev);
  }

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-[#E8E0D4]/90 bg-[#f8f8f0] shadow-[0_16px_48px_rgba(42,36,28,0.045)]",
        className
      )}
    >
      <div className="group relative block">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
          {isMap && tourOpen && hasTour ? (
            <iframe
              src={object.tour.url}
              title={`${object.name} — ${UI_CONFIG.common.tourBadge}`}
              className="absolute inset-0 h-full w-full border-0"
              allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <Link href={href} className="absolute inset-0 block">
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
            </Link>
          )}

          {hasTour ? (
            isMap ? (
              <button
                type="button"
                onClick={handleTourClick}
                className="absolute bottom-2.5 right-2.5 z-10 cursor-pointer"
                aria-pressed={tourOpen}
                aria-label={
                  tourOpen
                    ? UI_CONFIG.base.exitFullscreen
                    : UI_CONFIG.common.tourBadge
                }
              >
                <Badge
                  variant="tour"
                  text={tourOpen ? "Закрыть 3D" : UI_CONFIG.common.tourBadge}
                  className="pointer-events-none"
                />
              </button>
            ) : (
              <Badge
                variant="tour"
                text={UI_CONFIG.common.tourBadge}
                className="absolute bottom-2.5 right-2.5 z-10"
              />
            )
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3">
        <Link href={href} className="block">
          <Typography
            variant="h3"
            className="font-serif text-lg font-normal leading-snug tracking-wide text-[#1A241C] md:text-[17px]"
          >
            {object.name}
          </Typography>
          <Typography
            variant="caption"
            className="mt-1 block text-[13px] text-[#888] md:text-[11px]"
          >
            {object.location.district}
          </Typography>
        </Link>

        <Typography
          variant="body"
          className="mt-2.5 text-[15px] font-semibold text-[#1A241C] md:text-sm"
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
                <span className="font-sans text-[12px] leading-none text-stone-400 md:text-[11px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-3 rounded-lg border border-black bg-[#F8E9E4]/60 px-3 py-2.5">
          <Typography
            variant="caption"
            className="mb-1 block text-[13px] font-semibold text-[#BC5434] md:text-[11px]"
          >
            {UI_CONFIG.catalog.notForLabel}
          </Typography>
          <Typography
            variant="body"
            className="line-clamp-3 text-[14px] leading-relaxed text-[#555] md:text-[12px]"
          >
            {notFor}
          </Typography>
        </div>

        <div className="mt-auto pt-4">
          <Link
            href={href}
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#BC5434] px-3 font-sans text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#a0482c] md:h-9 md:text-xs"
          >
            {UI_CONFIG.common.bookCta}
          </Link>
        </div>
      </div>
    </article>
  );
}
