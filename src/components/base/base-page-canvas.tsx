import Link from "next/link";
import type { ReactNode } from "react";

import { AlertBox } from "@/components/ui/alert-box";
import { Button } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { BookingForm } from "@/components/base/booking-form";
import { TourPlayer } from "@/components/base/tour-player";
import { HeroPhoneLink } from "@/components/home/hero-phone-link";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import type { BaseObject, PhotoConfig } from "@/types";
import { cn } from "@/lib/utils";

const DESKTOP_INSET = "md:px-[15vw]";

function gallerySources(object: BaseObject): PhotoConfig[] {
  const items: PhotoConfig[] = [];
  const seen = new Set<string>();

  const push = (src: string, alt: string, caption = "") => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    items.push({ src, alt, caption });
  };

  push(object.tour.preview, object.name, "3D-тур");
  for (const photo of object.photos) {
    push(photo.src, photo.alt, photo.caption);
  }

  return items;
}

function amenityItems(object: BaseObject): { label: string; icon: IconName }[] {
  const labels = UI_CONFIG.base.amenityLabels;
  const items: { label: string; icon: IconName }[] = [];

  if (object.amenities.food) {
    items.push({ label: object.amenities.food, icon: "food" });
  }

  const iconByKey: Partial<Record<keyof typeof labels, IconName>> = {
    banya: "bath",
    pool: "pool",
    wifi: "wifi",
    kitchen: "food",
    heating: "fog",
    parking: "parking",
    waterfront: "water",
    pets: "tree",
    year_round: "mountains",
  };

  (Object.keys(labels) as (keyof typeof labels)[]).forEach((key) => {
    if (object.amenities[key]) {
      items.push({ label: labels[key], icon: iconByKey[key] ?? "check" });
    }
  });

  return items;
}

function BaseHeader() {
  return (
    <header className="w-full border-b border-stone-200/60 bg-[#FBFBFA]">
      <div
        className={cn(
          "mx-auto flex w-full items-center justify-between gap-4 px-6 py-4 md:py-5",
          DESKTOP_INSET
        )}
      >
        <Button
          variant="ghost"
          href={UI_CONFIG.home.catalogHref}
          className="flex items-center gap-2 px-0 text-sm font-sans font-medium text-stone-600 hover:bg-transparent hover:text-[#BC5434]"
        >
          {UI_CONFIG.detailPage.backToCatalog}
        </Button>

        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
          <Typography
            variant="h3"
            className="font-serif text-base tracking-wide text-[#1A241C] md:text-lg"
          >
            {GLOBAL_CONFIG.brandName}
          </Typography>
          <HeroPhoneLink
            phone={GLOBAL_CONFIG.phone}
            className="static font-sans text-sm font-semibold tracking-wide text-stone-600 md:text-base"
            linkClassName="hover:text-[#BC5434]"
          />
        </div>
      </div>
    </header>
  );
}

function PhotoThumbs({ photos }: { photos: PhotoConfig[] }) {
  if (photos.length === 0) return null;

  const slotCount = Math.min(4, photos.length);
  const hasOverflow = photos.length > 4;
  const visible = photos.slice(0, slotCount);
  const moreCount = photos.length - 3;

  return (
    <div
      className="mt-3 grid gap-2.5"
      style={{ gridTemplateColumns: `repeat(${slotCount}, minmax(0, 1fr))` }}
    >
      {visible.map((photo, index) => {
        const isOverflowSlot = hasOverflow && index === slotCount - 1;

        return (
          <div
            key={`${photo.src}-${index}`}
            className="relative aspect-video overflow-hidden rounded-lg border-0 bg-stone-200"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.alt}
              className={cn(
                "h-full w-full object-cover",
                isOverflowSlot && "brightness-[0.45]"
              )}
            />
            {isOverflowSlot ? (
              <span className="absolute inset-0 flex items-center justify-center font-sans text-sm font-medium text-white md:text-base">
                {`${UI_CONFIG.base.morePhotosPrefix} ${moreCount}`}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function PanelCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-stone-200/90 bg-white px-5 py-6 shadow-sm md:px-6 md:py-7">
      <Typography
        variant="h3"
        className="mb-4 font-sans text-[13px] font-bold tracking-wide text-[#1A241C] md:mb-5 md:text-sm"
      >
        {title}
      </Typography>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

function formatUnits(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return `${count} ${UI_CONFIG.base.unitsOne}`;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} ${UI_CONFIG.base.unitsFew}`;
  }
  return `${count} ${UI_CONFIG.base.unitsMany}`;
}

function DetailColumns({ object }: { object: BaseObject }) {
  const amenities = amenityItems(object);
  const address = [
    object.location.district,
    object.location.settlement,
    object.location.road,
  ]
    .filter(Boolean)
    .join(", ");

  const details: { label: string; icon: IconName }[] = [
    { label: object.type, icon: "home" },
    { label: address, icon: "map" },
    {
      label: `${object.capacity.min}–${object.capacity.max} ${UI_CONFIG.base.guestsLabel}`,
      icon: "users",
    },
    {
      label: formatUnits(object.capacity.units_count),
      icon: "home",
    },
  ];

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-3 sm:gap-5">
      <PanelCard title={UI_CONFIG.base.detailsTitle}>
        <ul className="space-y-3.5">
          {details.map((item) => (
            <li key={item.label} className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F1EC] text-[#4A5D4E]">
                <Icon name={item.icon} size={16} />
              </span>
              <Typography
                variant="body"
                className="pt-1.5 text-[13px] leading-snug text-[#2A2A24] md:text-sm"
              >
                {item.label}
              </Typography>
            </li>
          ))}
        </ul>
      </PanelCard>

      <PanelCard title={UI_CONFIG.base.amenitiesTitle}>
        <div className="flex flex-wrap content-start gap-2">
          {(amenities.length > 0
            ? amenities
            : [{ label: "—", icon: "check" as const }]
          ).map((item) => (
            <span
              key={item.label}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#F3F1EC] px-2.5 font-sans text-[12px] leading-none text-[#1A241C]"
            >
              <Icon name={item.icon} size={14} className="text-[#4A5D4E]" />
              {item.label}
            </span>
          ))}
        </div>
      </PanelCard>

      <PanelCard title={UI_CONFIG.base.priceTitle}>
        <div className="flex items-baseline gap-1.5">
          <span className="font-sans text-[12px] text-[#555]">
            {UI_CONFIG.base.pricePrefix}
          </span>
          <span className="font-serif text-[1.375rem] leading-none tracking-wide text-[#1A241C] md:text-[1.5rem]">
            {`${object.price.from.toLocaleString("ru-RU")} ₽`}
          </span>
          <span className="font-sans text-[12px] text-[#555]">
            /{object.price.unit}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
          {object.price.included.length > 0 ? (
            <div>
              <Typography
                variant="caption"
                className="mb-2.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#4A5D4E]"
              >
                Включено
              </Typography>
              <ul className="space-y-2.5">
                {object.price.included.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Icon
                      name="check"
                      size={14}
                      className="mt-0.5 shrink-0 text-[#4A5D4E]"
                    />
                    <Typography
                      variant="body"
                      className="text-[13px] leading-snug text-[#2A2A24] md:text-sm"
                    >
                      {item}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {object.price.extra.length > 0 ? (
            <div>
              <Typography
                variant="caption"
                className="mb-2.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#BC5434]"
              >
                Дополнительно
              </Typography>
              <ul className="space-y-2.5">
                {object.price.extra.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Icon
                      name="plus"
                      size={14}
                      className="mt-0.5 shrink-0 text-[#BC5434]"
                    />
                    <Typography
                      variant="body"
                      className="text-[13px] leading-snug text-[#2A2A24] md:text-sm"
                    >
                      {item}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {object.price.note ? (
          <Typography
            variant="caption"
            className="mt-auto pt-5 text-[11px] leading-relaxed text-[#888]"
          >
            {object.price.note}
          </Typography>
        ) : null}
      </PanelCard>
    </div>
  );
}

export function BasePageCanvas({ object }: { object: BaseObject }) {
  const photos = gallerySources(object);
  const locationLine = [
    object.location.district,
    `${object.location.distance_gorno_altaysk_km} ${UI_CONFIG.base.distanceFromGorno}`,
    `${object.location.distance_novosibirsk_km} ${UI_CONFIG.base.distanceFromNovosibirsk}`,
  ].join(" · ");

  const notForItems =
    object.author.not_for.length > 0
      ? object.author.not_for
      : [object.suitability.family_kids.note];

  const goodForItems =
    object.author.good_for.length > 0
      ? object.author.good_for
      : Object.values(object.suitability)
          .filter((item) => item.fit === "high" || item.fit === "medium")
          .map((item) => item.note);

  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen">
      <BaseHeader />

      <div
        className={cn(
          "mx-auto grid w-full gap-10 px-6 py-10 md:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] md:gap-12 md:py-14 lg:gap-14",
          DESKTOP_INSET
        )}
      >
        <div className="space-y-10 md:space-y-12">
          <section>
            <TourPlayer object={object} />
            <PhotoThumbs photos={photos} />
          </section>

          <section className="max-w-2xl space-y-3">
            <Typography
              variant="h1"
              className="font-serif text-3xl font-normal tracking-wide text-[#1A241C] md:text-4xl"
            >
              {object.name}
            </Typography>
            <Typography variant="caption" className="block text-[#555]">
              {locationLine}
            </Typography>
            <Typography variant="lead" className="pt-1 text-[#2A2A24]">
              {object.author.verdict}
            </Typography>
          </section>

          <section className="mx-auto max-w-xl space-y-3 text-center">
            <Typography
              variant="h2"
              className="text-xl font-bold uppercase tracking-[0.04em] text-[#1A241C] md:text-2xl"
            >
              {UI_CONFIG.base.honestNoteTitle}
            </Typography>
            <Typography
              variant="body"
              className="text-sm leading-relaxed text-[#555] md:text-[15px]"
            >
              {object.author.honest_note}
            </Typography>
          </section>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            <AlertBox
              variant="info"
              title={UI_CONFIG.base.goodForTitle}
              className="h-full px-5 py-5 md:px-6 md:py-6"
            >
              <ul className="mt-1 list-disc space-y-2 pl-5">
                {goodForItems.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-relaxed text-white/90 md:text-[15px]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </AlertBox>

            <AlertBox
              variant="danger"
              title={UI_CONFIG.base.notSuitableTitle}
              className="h-full px-5 py-5 md:px-6 md:py-6"
            >
              <ul className="mt-1 list-disc space-y-2 pl-5">
                {notForItems.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-relaxed text-[#2A2A24] md:text-[15px]"
                  >
                    {item}
                  </li>
                ))}
                {object.suitability.family_kids.note &&
                !notForItems.includes(object.suitability.family_kids.note) ? (
                  <li className="text-sm leading-relaxed text-[#2A2A24] md:text-[15px]">
                    {object.suitability.family_kids.note}
                  </li>
                ) : null}
              </ul>
            </AlertBox>
          </div>

          <DetailColumns object={object} />
        </div>

        <aside className="md:sticky md:top-8 md:self-start" id="booking">
          <BookingForm />
        </aside>
      </div>

      <footer className="w-full border-t border-[var(--chrome-border)] bg-[var(--chrome)]">
        <div
          className={cn(
            "mx-auto flex w-full items-end justify-between gap-4 px-6 pb-[100px] pt-8",
            DESKTOP_INSET
          )}
        >
          <Link
            href={UI_CONFIG.home.catalogHref}
            className="font-sans text-sm font-medium text-[#1A241C] transition-colors hover:text-[#BC5434] md:text-base"
          >
            {UI_CONFIG.base.aboutCatalog}
          </Link>
          <Typography variant="caption" className="text-xl text-[#1A241C]">
            {GLOBAL_CONFIG.companyName} {UI_CONFIG.common.copyright} {year}
          </Typography>
        </div>
      </footer>
    </main>
  );
}
