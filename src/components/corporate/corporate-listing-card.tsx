import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { UI_CONFIG } from "@/config/uiConfig";
import { assetPath } from "@/config/site";
import {
  formatEventsCapacityLabel,
  getEventsCapacityMax,
  hasAerialPanorama,
} from "@/lib/object-events";
import type { BaseObject } from "@/types";
import { cn } from "@/lib/utils";

function coverSrc(object: BaseObject) {
  return object.tour.preview || object.photos[0]?.src || "";
}

function venuesSummary(
  venues: NonNullable<BaseObject["events"]>["venues"]
): string {
  if (venues.length === 0) return UI_CONFIG.corporate.venuesUnknown;
  const first = venues[0];
  const name = first.name;
  if (venues.length === 1 && first.area_m2 != null) {
    return `${name} · ${first.area_m2} м²`;
  }
  if (venues.length === 1) return name;
  return `${venues.length} · ${name}`;
}

function FactRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[12px] leading-none text-[#888] md:text-[11px]">
        {label}
      </dt>
      <dd
        className="mt-1.5 truncate font-sans text-[13px] font-medium leading-snug text-[#1A241C] md:text-[12px]"
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}

export function CorporateListingCard({
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
  const events = object.events;
  const capacity = getEventsCapacityMax(object);
  const capacityLabel =
    formatEventsCapacityLabel(capacity) ?? UI_CONFIG.corporate.capacityUnknown;
  const aerial = hasAerialPanorama(object);
  const href = `/base/${object.slug}`;
  const venues = events?.venues ?? [];
  const buyout = events?.buyout.available;
  const cashless = events?.legal.cashless;
  const legalEntity = events?.legal.works_with_legal_entity;
  const beds =
    events?.sleeping.beds_total ?? events?.sleeping.beds_single_occupancy;
  const sleepingNote = events?.sleeping.note?.trim() ?? "";
  const buyoutNote = events?.buyout.note?.trim() ?? "";
  const isMap = mode === "map";
  const hasTour = Boolean(object.tour?.url);

  const buyoutLabel =
    buyout === true
      ? UI_CONFIG.corporate.buyoutYes
      : buyout === false
        ? UI_CONFIG.corporate.buyoutUnavailable
        : UI_CONFIG.corporate.buyoutNo;

  const sleepingLabel =
    beds != null ? String(beds) : UI_CONFIG.corporate.capacityUnknown;

  const footnote =
    beds == null && sleepingNote
      ? sleepingNote
      : buyout === true && buyoutNote
        ? buyoutNote
        : "";

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

          {aerial ? (
            <span className="pointer-events-none absolute left-2.5 top-2.5 z-10 rounded-md border border-white/25 bg-[#1A241C]/70 px-2.5 py-1 font-sans text-[11px] font-semibold tracking-wide text-white backdrop-blur-[2px]">
              {UI_CONFIG.corporate.aerialBadge}
            </span>
          ) : null}

          {hasTour ? (
            <Badge
              variant="tour"
              text={UI_CONFIG.common.tourBadge}
              className="absolute bottom-2.5 right-2.5 z-10"
            />
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
            className="mt-1 block text-[14px] text-[#888] md:text-[13px]"
          >
            {[object.location.settlement, object.location.district]
              .filter(Boolean)
              .join(" · ") || object.location.district}
          </Typography>
        </Link>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-stone-100 pt-3">
          <FactRow
            label={UI_CONFIG.corporate.capacityFilter}
            value={capacityLabel}
          />
          <FactRow label="Выкуп" value={buyoutLabel} />
          <FactRow
            label={UI_CONFIG.corporate.venuesLabel}
            value={venuesSummary(venues)}
          />
          <FactRow
            label={UI_CONFIG.corporate.sleepingLabel}
            value={sleepingLabel}
          />
        </dl>

        {(cashless === true || legalEntity === true) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {legalEntity === true ? (
              <span className="rounded-lg border border-black/[0.06] bg-[#F4F0E8] px-2 py-1 font-sans text-[11px] text-[#555]">
                {UI_CONFIG.corporate.legalEntity}
              </span>
            ) : null}
            {cashless === true ? (
              <span className="rounded-lg border border-black/[0.06] bg-[#F4F0E8] px-2 py-1 font-sans text-[11px] text-[#555]">
                {UI_CONFIG.corporate.cashless}
              </span>
            ) : null}
          </div>
        )}

        {footnote ? (
          <div className="mt-3 rounded-xl border border-black/[0.06] bg-gradient-to-br from-[#F4F0E8] to-[#EDE8DF]/80 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
            <p
              className="line-clamp-2 font-sans text-[14px] leading-relaxed text-[#555] md:text-[12px]"
              title={footnote}
            >
              {footnote}
            </p>
          </div>
        ) : null}

        <div className="mt-auto pt-4">
          <Link
            href={href}
            className={cn(
              "inline-flex h-10 w-full items-center justify-center rounded-xl bg-gradient-to-b from-[#c86648] to-[#a8482c] px-3 font-sans text-sm font-semibold tracking-wide text-white shadow-[0_4px_16px_rgba(188,84,52,0.28)] transition-all duration-300 hover:from-[#d07050] hover:to-[#b04e30] hover:shadow-[0_8px_24px_rgba(188,84,52,0.32)] md:h-9 md:text-xs",
              !isMap && "btn-tactile"
            )}
          >
            {UI_CONFIG.common.openObject}
          </Link>
        </div>
      </div>
    </article>
  );
}
