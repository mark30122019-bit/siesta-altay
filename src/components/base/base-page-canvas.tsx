import { AlertBox } from "@/components/ui/alert-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { BookingForm } from "@/components/base/booking-form";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import type { BaseObject } from "@/types";

const AMENITY_ICON_MAP: Partial<
  Record<keyof BaseObject["amenities"], IconName>
> = {
  banya: "bath",
  pool: "pool",
  wifi: "wifi",
  waterfront: "water",
  heating: "fog",
  pets: "tree",
  year_round: "mountains",
};

function getActiveAmenityIcons(amenities: BaseObject["amenities"]): IconName[] {
  return (
    Object.entries(amenities) as [
      keyof BaseObject["amenities"],
      boolean | string,
    ][]
  )
    .filter(([, value]) => value === true)
    .map(([key]) => AMENITY_ICON_MAP[key])
    .filter((name): name is IconName => Boolean(name));
}

export function BasePageCanvas({ object }: { object: BaseObject }) {
  const amenityIcons = getActiveAmenityIcons(object.amenities);
  const cover = object.photos[0] ?? {
    src: object.tour.preview,
    alt: object.name,
    caption: "",
  };
  const locationLine = [
    object.location.district,
    object.location.settlement,
    `${object.location.distance_gorno_altaysk_km} ${UI_CONFIG.base.distanceFromGorno}`,
  ].join(" · ");

  return (
    <main className="min-h-screen bg-[#FBFBFA]">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 md:px-6">
        <Typography variant="caption" className="text-[#1A241C]">
          {GLOBAL_CONFIG.companyName}
        </Typography>
        <Typography
          variant="caption"
          className="font-medium tracking-wide text-[#1A241C]"
        >
          {GLOBAL_CONFIG.brandName}
        </Typography>
      </header>

      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 pb-16 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:px-6">
        <div className="space-y-6">
          <Card className="overflow-hidden p-0">
            <div className="relative aspect-[16/10] bg-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={object.tour.preview || cover.src}
                alt={cover.alt}
                className="h-full w-full object-cover"
              />
              {object.tour.url ? (
                <Badge
                  variant="tour"
                  text={UI_CONFIG.base.tourBadge}
                  className="absolute bottom-4 right-4"
                />
              ) : null}
            </div>
          </Card>

          {object.tour.url ? (
            <Button
              variant="ghost"
              href={object.tour.url}
              className="w-full border border-stone-200 bg-white"
            >
              {UI_CONFIG.base.enter360}
            </Button>
          ) : null}

          <Typography variant="h1">{object.name}</Typography>

          <Typography variant="caption" className="block">
            {locationLine}
          </Typography>

          <Typography variant="h2">
            {`${UI_CONFIG.base.pricePrefix} ${object.price.from.toLocaleString("ru-RU")} ₽/${object.price.unit}`}
          </Typography>

          <Typography variant="lead">{object.author.verdict}</Typography>

          <Typography variant="h2">{UI_CONFIG.base.honestNoteTitle}</Typography>
          <Typography variant="body">{object.author.honest_note}</Typography>

          {amenityIcons.length > 0 ? (
            <div className="flex flex-wrap gap-3 text-[#4A5D4E]">
              {amenityIcons.map((name) => (
                <Icon key={name} name={name} size={22} />
              ))}
            </div>
          ) : null}

          <AlertBox variant="info" title={UI_CONFIG.base.goodForTitle}>
            {object.author.good_for.join(", ")}
          </AlertBox>

          <AlertBox
            variant="danger"
            title={UI_CONFIG.base.notSuitableTitle}
          >
            {object.suitability.family_kids.note}
          </AlertBox>
        </div>

        <aside className="space-y-4 md:sticky md:top-6 md:self-start">
          <Card className="p-5">
            <Typography variant="h2" className="mb-2">
              {object.name}
            </Typography>
            <Typography variant="body" className="mb-4 font-semibold">
              {`${UI_CONFIG.base.pricePrefix} ${object.price.from.toLocaleString("ru-RU")} ₽/${object.price.unit}`}
            </Typography>
            <Button variant="outline" href="#booking" className="w-full">
              {UI_CONFIG.base.bookCta}
            </Button>
          </Card>

          <div id="booking">
            <BookingForm />
          </div>
        </aside>
      </div>
    </main>
  );
}
