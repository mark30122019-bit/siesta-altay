"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Icon, type IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { UI_CONFIG } from "@/config/uiConfig";
import { assetPath } from "@/config/site";
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
  onClose,
}: {
  object: BaseObject;
  className?: string;
  mode?: "list" | "map";
  onClose?: () => void;
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
        "surface-card flex h-full flex-col overflow-hidden rounded-2xl",
        !isMap && "surface-card-interactive",
        isMap && "group",
        className
      )}
    >
      <div className={cn("relative block", !isMap && "group")}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#d4cfc4] via-[#c5bfb2] to-[#a8b0a4] shimmer">
          {isMap && onClose ? (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onClose();
              }}
              className="absolute right-3 top-3 z-20 flex size-8 cursor-pointer items-center justify-center rounded-full bg-[#1A241C]/55 text-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_14px_rgba(0,0,0,0.22)] backdrop-blur-[5px] transition-[background-color,transform] duration-200 hover:bg-[#1A241C]/72 active:scale-95 motion-reduce:active:scale-100"
              aria-label={UI_CONFIG.catalog.closeCard}
            >
              <Icon name="close" size={15} />
            </button>
          ) : null}

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
                  src={assetPath(src)}
                  alt={object.name}
                  className={cn(
                    "h-full w-full object-cover motion-reduce:transition-none",
                    isMap
                      ? "transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      : "transition-opacity duration-300 group-hover:opacity-90"
                  )}
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

        <div className="mt-3 rounded-xl border border-black/[0.06] bg-gradient-to-br from-[#FCEEE8] to-[#F8E9E4]/80 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
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
            className={cn(
              "inline-flex h-10 w-full items-center justify-center rounded-xl bg-gradient-to-b from-[#c86648] to-[#a8482c] px-3 font-sans text-sm font-semibold tracking-wide text-white shadow-[0_4px_16px_rgba(188,84,52,0.28)] transition-all duration-300 hover:from-[#d07050] hover:to-[#b04e30] hover:shadow-[0_8px_24px_rgba(188,84,52,0.32)] md:h-9 md:text-xs",
              isMap ? "" : "btn-tactile"
            )}
          >
            {UI_CONFIG.common.bookCta}
          </Link>
        </div>
      </div>
    </article>
  );
}
