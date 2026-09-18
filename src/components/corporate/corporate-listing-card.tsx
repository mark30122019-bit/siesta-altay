import Link from "next/link";

import { Badge } from "@/components/ui/badge";
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

export function CorporateListingCard({
  object,
  className,
}: {
  object: BaseObject;
  className?: string;
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
  const beds = events?.sleeping.beds_total ?? events?.sleeping.beds_single_occupancy;
  const sleepingNote = events?.sleeping.note?.trim() ?? "";

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl border border-[#2A2F2C] bg-[#151A17] text-[#E8E6E1]",
        className
      )}
    >
      <Link href={href} className="group relative block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#1E2420]">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={assetPath(src)}
              alt={object.name}
              className="h-full w-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            />
          ) : (
            <div
              className="h-full w-full bg-[linear-gradient(145deg,#2a322c_0%,#1a211c_55%,#121612_100%)]"
              aria-hidden
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1210]/85 via-transparent to-transparent" />
          {aerial ? (
            <span className="absolute left-3 top-3 rounded-md border border-white/20 bg-[#0E1210]/75 px-2.5 py-1 font-sans text-[11px] font-semibold tracking-wide text-[#E8E6E1] backdrop-blur-[2px]">
              {UI_CONFIG.corporate.aerialBadge}
            </span>
          ) : null}
          {object.tour.url ? (
            <Badge
              variant="tour"
              text={UI_CONFIG.common.tourBadge}
              className="absolute bottom-3 right-3"
            />
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3.5">
        <Link href={href} className="block">
          <Typography
            variant="h3"
            className="font-sans text-[17px] font-semibold tracking-wide text-[#F2F0EA]"
          >
            {object.name}
          </Typography>
          {object.location.district || object.location.settlement ? (
            <Typography
              variant="caption"
              className="mt-1 block text-[12px] tracking-wide text-[#9A968C]"
            >
              {[object.location.settlement, object.location.district]
                .filter(Boolean)
                .join(" · ")}
            </Typography>
          ) : null}
        </Link>

        <dl className="grid grid-cols-1 gap-2 border-t border-white/10 pt-3 font-sans text-[13px]">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-[#8A867C]">{UI_CONFIG.corporate.capacityFilter}</dt>
            <dd className="text-right font-medium text-[#E8E6E1]">
              {capacityLabel}
            </dd>
          </div>

          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-[#8A867C]">Выкуп</dt>
            <dd className="text-right font-medium text-[#E8E6E1]">
              {buyout === true
                ? UI_CONFIG.corporate.buyoutYes
                : buyout === false
                  ? "Нет"
                  : UI_CONFIG.corporate.buyoutNo}
            </dd>
          </div>

          {venues.length > 0 ? (
            <div className="flex items-start justify-between gap-3">
              <dt className="shrink-0 text-[#8A867C]">
                {UI_CONFIG.corporate.venuesLabel}
              </dt>
              <dd className="text-right font-medium leading-snug text-[#E8E6E1]">
                {venues.map((venue) => venue.name).join(", ")}
                {venues[0]?.area_m2 != null
                  ? ` · ${venues[0].area_m2} м²`
                  : null}
              </dd>
            </div>
          ) : null}

          {beds != null || sleepingNote ? (
            <div className="flex items-start justify-between gap-3">
              <dt className="shrink-0 text-[#8A867C]">
                {UI_CONFIG.corporate.sleepingLabel}
              </dt>
              <dd className="text-right font-medium leading-snug text-[#E8E6E1]">
                {beds != null ? String(beds) : sleepingNote}
              </dd>
            </div>
          ) : null}

          {(cashless === true || legalEntity === true) && (
            <div className="flex flex-wrap justify-end gap-1.5 pt-1">
              {legalEntity === true ? (
                <span className="rounded-md border border-white/15 px-2 py-0.5 text-[11px] text-[#C9C4B8]">
                  {UI_CONFIG.corporate.legalEntity}
                </span>
              ) : null}
              {cashless === true ? (
                <span className="rounded-md border border-white/15 px-2 py-0.5 text-[11px] text-[#C9C4B8]">
                  {UI_CONFIG.corporate.cashless}
                </span>
              ) : null}
            </div>
          )}
        </dl>

        {object.author.good_for[0] ? (
          <Typography
            variant="body"
            className="mt-auto border-t border-white/10 pt-3 text-[13px] leading-relaxed text-[#B8B3A8]"
          >
            {object.author.good_for[0].charAt(0).toLocaleUpperCase("ru-RU") +
              object.author.good_for[0].slice(1)}
          </Typography>
        ) : null}

        <Link
          href={href}
          className="mt-1 inline-flex w-fit items-center font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-[#D4A24A] transition-colors hover:text-[#E8C06A]"
        >
          {UI_CONFIG.corporate.openObject} →
        </Link>
      </div>
    </article>
  );
}
