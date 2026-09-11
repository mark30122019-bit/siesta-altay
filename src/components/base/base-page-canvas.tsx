import type { ReactNode } from "react";

import { AlertBox } from "@/components/ui/alert-box";
import { Icon, type IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { BasePageFooter, BasePageHeader } from "@/components/base/base-page-chrome";
import { BookingForm } from "@/components/base/booking-form";
import { TourPlayer } from "@/components/base/tour-player";
import { UI_CONFIG } from "@/config/uiConfig";
import { hasObjectPrice } from "@/lib/object-price";
import { hasAmenityFlag } from "@/lib/object-flags";
import { splitProseParagraphs } from "@/lib/format-prose";
import type { BaseObject } from "@/types";
import { cn } from "@/lib/utils";

const DESKTOP_INSET = "md:px-[10vw]";

function amenityItems(object: BaseObject): { label: string; icon: IconName }[] {
  const labels = UI_CONFIG.base.amenityLabels;
  const items: { label: string; icon: IconName }[] = [];

  const food = object.amenities.food;
  if (typeof food === "string" && food.trim()) {
    items.push({ label: food, icon: "food" });
  } else if (food === true) {
    items.push({ label: UI_CONFIG.base.foodAmenityLabel, icon: "food" });
  }

  const iconByKey: Partial<Record<keyof typeof labels, IconName>> = {
    banya: "bath",
    pool: "pool",
    wifi: "wifi",
    kitchen: "food",
    heating: "fog",
    parking: "parking",
    waterfront: "water",
    pets: "dog",
    year_round: "mountains",
  };

  (Object.keys(labels) as (keyof typeof labels)[]).forEach((key) => {
    if (hasAmenityFlag(object.amenities[key] as boolean | null)) {
      items.push({ label: labels[key], icon: iconByKey[key] ?? "check" });
    }
  });

  return items;
}

function PanelCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="surface-card flex h-full flex-col rounded-2xl px-5 py-7 md:px-7 md:py-8">
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

function formatUnits(count: number | null) {
  if (count == null || count <= 0) return null;
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

function formatGuests(min: number | null, max: number | null) {
  if (min != null && max != null) {
    return `${min}–${max} ${UI_CONFIG.base.guestsLabel}`;
  }
  if (max != null) return `до ${max} ${UI_CONFIG.base.guestsLabel}`;
  if (min != null) return `от ${min} ${UI_CONFIG.base.guestsLabel}`;
  return null;
}

function formatNights(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return `${count} ${UI_CONFIG.base.nightsOne}`;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} ${UI_CONFIG.base.nightsFew}`;
  }
  return `${count} ${UI_CONFIG.base.nightsMany}`;
}

function AuthorVerdict({ text }: { text: string }) {
  if (!text.trim()) return null;

  const paragraphs = splitProseParagraphs(text);

  return (
    <div className="space-y-4 pt-2 md:space-y-5">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={cn(
            "font-serif text-[17px] font-normal not-italic leading-[1.75] tracking-[0.01em] text-[#2C3228] md:text-[1.125rem] md:leading-[1.8]",
            index === 0 && "text-[#1A241C]"
          )}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function bookingTermItems(object: BaseObject): { label: string; value: string }[] {
  const { booking } = object;
  const items: { label: string; value: string }[] = [];

  if (booking.checkin) {
    items.push({ label: UI_CONFIG.base.checkinLabel, value: booking.checkin });
  }
  if (booking.checkout) {
    items.push({
      label: UI_CONFIG.base.checkoutLabel,
      value: booking.checkout,
    });
  }
  if (booking.min_nights != null && booking.min_nights > 0) {
    items.push({
      label: UI_CONFIG.base.minNightsLabel,
      value: formatNights(booking.min_nights),
    });
  }
  if (
    booking.min_nights_high_season != null &&
    booking.min_nights_high_season > 0
  ) {
    items.push({
      label: UI_CONFIG.base.minNightsHighSeasonLabel,
      value: formatNights(booking.min_nights_high_season),
    });
  }
  if (booking.prepayment) {
    items.push({
      label: UI_CONFIG.base.prepaymentLabel,
      value: booking.prepayment,
    });
  }

  return items;
}

function tourMetaLine(object: BaseObject): string | null {
  const parts: string[] = [];
  if (object.tour.scenes_count != null && object.tour.scenes_count > 0) {
    parts.push(
      `${object.tour.scenes_count} ${UI_CONFIG.base.tourScenesSuffix}`
    );
  }
  if (object.tour.features?.trim()) {
    parts.push(
      `${UI_CONFIG.base.tourFeaturesLabel}: ${object.tour.features.trim()}`
    );
  }
  return parts.length > 0 ? parts.join(" · ") : null;
}

function DetailColumns({ object }: { object: BaseObject }) {
  const amenities = amenityItems(object);
  const address = [
    object.location.region,
    object.location.district,
    object.location.settlement,
    object.location.road,
  ]
    .filter(Boolean)
    .join(", ");

  const guestsLabel = formatGuests(
    object.capacity.min,
    object.capacity.max
  );
  const unitsLabel = formatUnits(object.capacity.units_count);

  const details: { label: string; icon: IconName }[] = [
    { label: object.type, icon: "home" },
  ];
  if (address) details.push({ label: address, icon: "map" });
  if (guestsLabel) details.push({ label: guestsLabel, icon: "users" });
  if (unitsLabel) details.push({ label: unitsLabel, icon: "home" });

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
        {hasObjectPrice(object) ? (
          <>
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
                    {UI_CONFIG.base.priceIncluded}
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
                    {UI_CONFIG.base.priceExtra}
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

            {object.price.high_season.length > 0 ? (
              <div className="mt-6">
                <Typography
                  variant="caption"
                  className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B635A]"
                >
                  {UI_CONFIG.base.priceHighSeason}
                </Typography>
                <ul className="space-y-2">
                  {object.price.high_season.map((item) => (
                    <li key={item}>
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

            {object.price.note ? (
              <Typography
                variant="caption"
                className="mt-auto pt-6 text-[11px] leading-relaxed text-[#8A8278]"
              >
                {object.price.note}
              </Typography>
            ) : null}
          </>
        ) : (
          <Typography
            variant="body"
            className="text-[13px] leading-relaxed text-[#2C3228] md:text-sm"
          >
            {UI_CONFIG.base.priceNote}
          </Typography>
        )}
      </PanelCard>
    </div>
  );
}

export function BasePageCanvas({ object }: { object: BaseObject }) {
  const bookingTerms = bookingTermItems(object);
  const tourMeta = tourMetaLine(object);
  const locationLine = [
    object.location.region,
    object.location.district || object.location.settlement,
    object.location.distance_gorno_altaysk_km != null
      ? `${object.location.distance_gorno_altaysk_km} ${UI_CONFIG.base.distanceFromGorno}`
      : null,
    object.location.distance_novosibirsk_km != null
      ? `${object.location.distance_novosibirsk_km} ${UI_CONFIG.base.distanceFromNovosibirsk}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const notForItems =
    object.author.not_for.length > 0
      ? object.author.not_for
      : [object.suitability.family_kids.note];

  const goodForItems =
    object.author.good_for.length > 0
      ? object.author.good_for
      : Object.values(object.suitability)
          .filter((item) => item.fit === true)
          .map((item) => item.note);

  return (
    <main className="min-h-screen bg-[#F4F0E8]">
      <BasePageHeader />

      <div
        className={cn(
          "mx-auto grid w-full gap-12 px-6 pt-12 pb-[15vh] md:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] md:gap-14 md:pt-16 md:pb-[17vh] lg:gap-16 lg:pt-20",
          DESKTOP_INSET
        )}
      >
        <div className="space-y-14 md:space-y-16">
          <section>
            <TourPlayer object={object} />
            {tourMeta ? (
              <Typography
                variant="caption"
                className="mt-3 block text-[12px] leading-relaxed text-[#8A8278]"
              >
                {tourMeta}
              </Typography>
            ) : null}
          </section>

          <section className="space-y-5">
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
            <AuthorVerdict text={object.author.verdict} />
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

        <aside className="space-y-5 md:sticky md:top-10 md:self-start" id="booking">
          {bookingTerms.length > 0 ? (
            <div className="surface-card rounded-2xl px-5 py-6 md:px-6 md:py-7">
              <Typography
                variant="h3"
                className="mb-4 font-sans text-[12px] font-bold uppercase tracking-[0.12em] text-[#6B635A] md:text-[13px]"
              >
                {UI_CONFIG.base.bookingTermsTitle}
              </Typography>
              <dl className="space-y-3">
                {bookingTerms.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start justify-between gap-4"
                  >
                    <dt className="shrink-0 font-sans text-[12px] text-[#8A8278]">
                      {item.label}
                    </dt>
                    <dd className="text-right font-sans text-[13px] leading-snug text-[#2C3228] md:text-sm">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
          <BookingForm objectName={object.name} objectSlug={object.slug} />
        </aside>
      </div>

      <BasePageFooter />
    </main>
  );
}
