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
    <header className="w-full border-b border-[#f8f8f0] bg-[#f8f8f0]">
      <div
        className={cn(
          "mx-auto flex w-full items-center justify-between gap-4 px-6 py-5 md:py-6",
          DESKTOP_INSET
        )}
      >
        <Button
          variant="ghost"
          href={UI_CONFIG.home.catalogHref}
          className="flex items-center gap-2 px-0 font-sans text-sm font-medium tracking-wide text-[#6B635A] hover:bg-transparent hover:text-[#8F5A4A]"
        >
          {UI_CONFIG.detailPage.backToCatalog}
        </Button>

        <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1">
          <Link
            href="/"
            className="cursor-pointer font-serif text-base font-normal tracking-[0.06em] text-[#1A241C] transition-colors hover:text-[#8F5A4A] md:text-lg"
          >
            {GLOBAL_CONFIG.brandName}
          </Link>
          <HeroPhoneLink
            phone={GLOBAL_CONFIG.phone}
            className="static font-sans text-sm font-medium tracking-wide text-[#6B635A] md:text-base"
            linkClassName="hover:text-[#8F5A4A]"
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
      className="mt-4 grid gap-3"
      style={{ gridTemplateColumns: `repeat(${slotCount}, minmax(0, 1fr))` }}
    >
      {visible.map((photo, index) => {
        const isOverflowSlot = hasOverflow && index === slotCount - 1;

        return (
          <div
            key={`${photo.src}-${index}`}
            className="relative aspect-video overflow-hidden rounded-xl bg-[#E8E0D4] shadow-[0_8px_24px_rgba(42,36,28,0.05)]"
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
    <div className="flex h-full flex-col rounded-2xl border border-[#E8E0D4]/90 bg-[#f8f8f0] px-5 py-7 shadow-[0_16px_48px_rgba(42,36,28,0.045)] md:px-7 md:py-8">
      <Typography
        variant="h3"
        className="mb-5 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-[#6B635A] md:mb-6 md:text-[13px]"
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
    <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-3 sm:gap-6">
      <PanelCard title={UI_CONFIG.base.detailsTitle}>
        <ul className="space-y-4">
          {details.map((item) => (
            <li key={item.label} className="flex items-start gap-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F0EBE3] text-[#6B635A]">
                <Icon name={item.icon} size={16} />
              </span>
              <Typography
                variant="body"
                className="pt-2 text-[13px] leading-relaxed text-[#2C3228] md:text-sm"
              >
                {item.label}
              </Typography>
            </li>
          ))}
        </ul>
      </PanelCard>

      <PanelCard title={UI_CONFIG.base.amenitiesTitle}>
        <div className="flex flex-wrap content-start gap-2.5">
          {(amenities.length > 0
            ? amenities
            : [{ label: "—", icon: "check" as const }]
          ).map((item) => (
            <span
              key={item.label}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#F0EBE3] px-3 font-sans text-[12px] leading-none text-[#2C3228]"
            >
              <Icon name={item.icon} size={15} className="text-[#6B635A]" />
              {item.label}
            </span>
          ))}
        </div>
      </PanelCard>

      <PanelCard title={UI_CONFIG.base.priceTitle}>
        <div className="flex items-baseline gap-1.5">
          <span className="font-sans text-[12px] text-[#8A8278]">
            {UI_CONFIG.base.pricePrefix}
          </span>
          <span className="font-serif text-[1.5rem] leading-none tracking-wide text-[#1A241C] md:text-[1.65rem]">
            {`${object.price.from.toLocaleString("ru-RU")} ₽`}
          </span>
          <span className="font-sans text-[12px] text-[#8A8278]">
            /{object.price.unit}
          </span>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
          {object.price.included.length > 0 ? (
            <div>
              <Typography
                variant="caption"
                className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B635A]"
              >
                Включено
              </Typography>
              <ul className="space-y-2.5">
                {object.price.included.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Icon
                      name="check"
                      size={14}
                      className="mt-0.5 shrink-0 text-[#6B635A]"
                    />
                    <Typography
                      variant="body"
                      className="text-[13px] leading-snug text-[#2C3228] md:text-sm"
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
                className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8F5A4A]"
              >
                Дополнительно
              </Typography>
              <ul className="space-y-2.5">
                {object.price.extra.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Icon
                      name="plus"
                      size={14}
                      className="mt-0.5 shrink-0 text-[#8F5A4A]"
                    />
                    <Typography
                      variant="body"
                      className="text-[13px] leading-snug text-[#2C3228] md:text-sm"
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
            className="mt-auto pt-6 text-[11px] leading-relaxed text-[#8A8278]"
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
    <main className="min-h-screen bg-[#F4F0E8]">
      <BaseHeader />

      <div
        className={cn(
          "mx-auto grid w-full gap-12 px-6 py-12 md:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] md:gap-14 md:py-16 lg:gap-16 lg:py-20",
          DESKTOP_INSET
        )}
      >
        <div className="space-y-14 md:space-y-16">
          <section>
            <TourPlayer object={object} />
            <PhotoThumbs photos={photos} />
          </section>

          <section className="max-w-2xl space-y-5">
            <Typography
              variant="h1"
              className="font-serif text-3xl font-normal tracking-[0.02em] text-[#1A241C] md:text-[2.75rem] md:leading-tight"
            >
              {object.name}
            </Typography>
            <Typography
              variant="caption"
              className="block text-[13px] tracking-wide text-[#8A8278]"
            >
              {locationLine}
            </Typography>
            <Typography
              variant="lead"
              className="pt-1 text-[17px] leading-relaxed text-[#2C3228] md:text-lg"
            >
              {object.author.verdict}
            </Typography>
          </section>

          <section className="mx-auto max-w-xl space-y-5 text-center">
            <Typography
              variant="h2"
              className="font-sans text-lg font-bold uppercase tracking-[0.08em] text-[#1A241C] md:text-xl"
            >
              {UI_CONFIG.base.honestNoteTitle}
            </Typography>
            <Typography
              variant="body"
              className="text-[15px] leading-[1.75] text-[#6B635A] md:text-base"
            >
              {object.author.honest_note}
            </Typography>
          </section>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <AlertBox
              variant="info"
              title={UI_CONFIG.base.goodForTitle}
              className="h-full"
            >
              <ul className="mt-1 list-disc space-y-2.5 pl-5">
                {goodForItems.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-relaxed text-[#F7F3ED]/88 md:text-[15px]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </AlertBox>

            <AlertBox
              variant="danger"
              title={UI_CONFIG.base.notSuitableTitle}
              className="h-full"
            >
              <ul className="mt-1 list-disc space-y-2.5 pl-5">
                {notForItems.map((item) => (
                  <li
                    key={item}
                    className="text-sm leading-relaxed text-[#3D3832]/85 md:text-[15px]"
                  >
                    {item}
                  </li>
                ))}
                {object.suitability.family_kids.note &&
                !notForItems.includes(object.suitability.family_kids.note) ? (
                  <li className="text-sm leading-relaxed text-[#3D3832]/85 md:text-[15px]">
                    {object.suitability.family_kids.note}
                  </li>
                ) : null}
              </ul>
            </AlertBox>
          </div>

          <DetailColumns object={object} />
        </div>

        <aside className="md:sticky md:top-10 md:self-start" id="booking">
          <BookingForm />
        </aside>
      </div>

      <footer className="w-full border-t border-[#f8f8f0] bg-[#f8f8f0]">
        <div
          className={cn(
            "relative mx-auto flex min-h-[140px] w-full items-center justify-center px-6 py-10",
            DESKTOP_INSET
          )}
        >
          <Link
            href={UI_CONFIG.home.catalogHref}
            className="absolute left-6 top-1/2 hidden -translate-y-1/2 font-sans text-sm font-medium tracking-wide text-[#1A241C] transition-colors hover:text-[#8F5A4A] md:left-[15vw] md:inline md:text-base"
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
