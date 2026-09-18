import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/ui/icon";
import { UI_CONFIG } from "@/config/uiConfig";
import {
  buyoutFacts,
  cateringFacts,
  equipmentFacts,
  eventsSummaryItems,
  formatEventsBool,
  formatEventsNullable,
  legalFacts,
  logisticsFacts,
  seasonFacts,
  sleepingFacts,
  venueCapacityLines,
  type EventsFact,
} from "@/lib/base-page-mode";
import type { BaseObject, EventsConfig, EventsVenue } from "@/types";
import { cn } from "@/lib/utils";

const UNKNOWN = UI_CONFIG.corporate.capacityUnknown;

const FACT_ICONS: Record<string, IconName> = {
  "Выкуп целиком": "houses",
  "Мин. гостей": "users",
  "Мин. ночей": "calendar",
  "Всего спальных мест": "sigma",
  "По одному в номере": "user",
  "Своя кухня": "apple",
  "Банкетное меню": "iceCream",
  "Внешний кейтеринг": "waiter",
  Проектор: "projector",
  Экран: "screen",
  Звук: "speaker",
  Микрофоны: "mic",
  Сцена: "ceremony",
  "Питание на улице": "plug",
  "Wi‑Fi для конференции": "wifi",
  "Подъезд автобуса": "arrowLeft",
  "Разворот автобуса": "uTurn",
  "Парковка (авто)": "parking",
  Дорога: "map",
  "От Новосибирска, ч": "city",
  "Круглый год": "globe",
  "Зимние мероприятия": "snowflake",
  "Отапливаемые залы": "thermometer",
  "Работа с юрлицом": "vendors",
  Безнал: "document",
  НДС: "document",
  "Закрывающие документы": "document",
  [UI_CONFIG.weddings.ceremonySpot]: "ceremony",
  [UI_CONFIG.weddings.rainPlan]: "umbrella",
  [UI_CONFIG.weddings.brideRoom]: "door",
  "Свои подрядчики": "vendors",
  "Эксклюзивная дата": "star",
  "Комендантский час": "calendar",
};

const SECTION_ICONS: Record<string, IconName> = {
  [UI_CONFIG.corporate.page.venuesTitle]: "home",
  [UI_CONFIG.corporate.page.buyoutTitle]: "ruble",
  [UI_CONFIG.corporate.page.sleepingTitle]: "bed",
  [UI_CONFIG.corporate.page.cateringTitle]: "utensils",
  [UI_CONFIG.corporate.page.equipmentTitle]: "userScreen",
  [UI_CONFIG.corporate.page.logisticsTitle]: "bus",
  [UI_CONFIG.corporate.page.seasonTitle]: "leaf",
  [UI_CONFIG.corporate.page.legalTitle]: "document",
  [UI_CONFIG.weddings.page.weddingTitle]: "heart",
  "Активности на базе": "mountains",
};

function isUnknownValue(value: string) {
  return value === UNKNOWN;
}

export function EventsSummaryBar({ object }: { object: BaseObject }) {
  const items = eventsSummaryItems(object);

  return (
    <section
      className="rounded-2xl border border-[#E6E1D8] bg-[#FBF9F5] px-3 py-3 shadow-[0_1px_2px_rgba(42,36,28,0.04)] md:px-4 md:py-3.5"
      aria-label="Ключевые факты"
    >
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0 lg:divide-x lg:divide-[#EEEAE3]">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex min-w-0 flex-col gap-0.5 rounded-xl px-2.5 py-2 lg:rounded-none lg:px-3"
          >
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8A8278]">
              {item.label}
            </span>
            <span
              className={cn(
                "truncate font-sans text-[14px] leading-snug md:text-[15px]",
                item.known
                  ? "font-semibold text-[#2F2D2A]"
                  : "font-normal text-[#9A9288]"
              )}
            >
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function activityIcon(label: string): IconName {
  const text = label.toLowerCase();
  if (text.includes("бан")) return "bath";
  if (text.includes("бассейн")) return "pool";
  if (text.includes("лодк") || text.includes("лодок") || text.includes("парус")) {
    return "boat";
  }
  if (text.includes("квадро")) return "bike";
  if (text.includes("бег") || text.includes("дорожк")) return "footprints";
  if (text.includes("каток") || text.includes("снег") || text.includes("зим")) {
    return "snowflake";
  }
  if (text.includes("вод") || text.includes("рыб")) return "water";
  if (text.includes("wifi") || text.includes("wi-fi") || text.includes("wi‑fi")) {
    return "wifi";
  }
  if (text.includes("парк")) return "parking";
  if (text.includes("еда") || text.includes("кухн") || text.includes("завтрак")) {
    return "utensils";
  }
  if (text.includes("фото")) return "camera";
  if (text.includes("дом") || text.includes("номер")) return "home";
  return "check";
}

function Tile({
  title,
  children,
  className,
  icon,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: IconName;
}) {
  const sectionIcon = icon ?? SECTION_ICONS[title];

  return (
    <section
      className={cn(
        "rounded-2xl border border-[#E6E1D8] bg-[#FBF9F5] px-5 py-5 shadow-[0_1px_2px_rgba(42,36,28,0.04)] md:px-6 md:py-6",
        className
      )}
    >
      <h3 className="mb-4 flex items-center gap-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A8278] md:mb-5 md:text-[12px]">
        {sectionIcon ? (
          <span className="flex size-11 items-center justify-center rounded-xl bg-[#F0EBE3] text-[#6B635A]">
            <Icon name={sectionIcon} size={22} />
          </span>
        ) : null}
        {title}
      </h3>
      {children}
    </section>
  );
}

function FactValue({ value }: { value: string }) {
  const unknown = isUnknownValue(value);
  return (
    <span
      className={cn(
        "text-right font-sans text-[13px] leading-snug md:text-[14px]",
        unknown
          ? "font-normal text-[#9A9288]"
          : "font-medium text-[#3A3834]"
      )}
    >
      {value}
    </span>
  );
}

function FactList({
  facts,
  note,
  icons,
}: {
  facts: EventsFact[];
  note?: string;
  icons?: Record<string, IconName>;
}) {
  return (
    <div className="space-y-0">
      <dl className="divide-y divide-[#EEEAE3]">
        {facts.map((fact) => {
          const icon = icons?.[fact.label] ?? FACT_ICONS[fact.label];
          return (
            <div
              key={fact.label}
              className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
            >
              <dt className="flex min-w-0 items-center gap-2.5 font-sans text-[13px] leading-snug text-[#5C574F] md:text-[14px]">
                {icon ? (
                  <Icon
                    name={icon}
                    size={18}
                    className="shrink-0 text-[#8A8278]"
                  />
                ) : null}
                <span className="min-w-0">{fact.label}</span>
              </dt>
              <dd className="shrink-0">
                <FactValue value={fact.value} />
              </dd>
            </div>
          );
        })}
      </dl>
      {note?.trim() ? (
        <p className="mt-4 border-t border-[#EEEAE3] pt-4 font-sans text-[13px] leading-relaxed text-[#7A746C] md:text-[14px]">
          {note.trim()}
        </p>
      ) : null}
    </div>
  );
}

function venueTypeLabel(
  type: string | null | undefined,
  venueName?: string
): string | null {
  const raw = type?.trim();
  if (!raw) return null;

  const labels: Record<string, string> = {
    conference_hall: "Конференц-зал",
    banquet_hall: "Банкетный зал",
    meeting_room: "Переговорная",
    dome: "Купол",
    outdoor: "Открытая площадка",
    tent: "Шатёр",
    restaurant: "Ресторан",
  };

  const label = labels[raw] ?? (/^[a-z0-9_]+$/i.test(raw) ? null : raw);
  if (!label) return null;
  if (venueName?.trim().toLowerCase() === label.toLowerCase()) return null;
  return label;
}

function venueMetaLine(venue: EventsVenue): string {
  const copy = UI_CONFIG.corporate.page;
  return [
    venue.indoor === true
      ? copy.indoorYes
      : venue.indoor === false
        ? copy.indoorNo
        : null,
    venue.area_m2 != null ? `${copy.areaLabel}: ${venue.area_m2} м²` : null,
    venueTypeLabel(venue.type, venue.name),
  ]
    .filter(Boolean)
    .join(" · ");
}

function VenueIndexBadge({ index }: { index: number }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F0EBE3] font-sans text-[13px] font-semibold tabular-nums text-[#2F2D2A] md:text-[14px]">
      {index + 1}
    </span>
  );
}

function VenueCard({
  venue,
  index,
}: {
  venue: EventsVenue;
  index: number;
}) {
  const copy = UI_CONFIG.corporate.page;
  const meta = venueMetaLine(venue);
  const capacity = venueCapacityLines(venue);
  const heated = formatEventsBool(venue.heated);

  return (
    <div className="space-y-3.5">
      <div className="flex items-start gap-3.5">
        <VenueIndexBadge index={index} />
        <div className="min-w-0 pt-0.5">
          <h4 className="font-sans text-[18px] font-semibold leading-snug tracking-[-0.01em] text-[#2F2D2A] md:text-[20px]">
            {venue.name}
          </h4>
          {meta ? (
            <p className="mt-1 font-sans text-[13px] leading-relaxed text-[#8A8278] md:text-[14px]">
              {meta}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2.5 font-sans text-[13px] leading-relaxed text-[#8A8278] md:text-[14px]">
        <Icon name="thermometer" size={18} className="shrink-0 text-[#8A8278]" />
        <span>
          {copy.heatedLabel}:{" "}
          <span
            className={cn(
              isUnknownValue(heated) ? "text-[#9A9288]" : "text-[#5C574F]"
            )}
          >
            {heated}
          </span>
        </span>
      </div>

      {capacity.length > 0 ? (
        <div className="flex items-start gap-2.5 font-sans text-[13px] leading-relaxed text-[#5C574F] md:text-[14px]">
          <Icon name="users" size={18} className="mt-0.5 shrink-0 text-[#8A8278]" />
          <span>Рассадка: {capacity.join(" · ")}</span>
        </div>
      ) : null}

      {venue.note.trim() ? (
        <p className="mt-1 border-t border-[#EEEAE3] pt-4 font-sans text-[13px] leading-relaxed text-[#7A746C] md:text-[14px] md:leading-[1.65]">
          {venue.note.trim()}
        </p>
      ) : null}
    </div>
  );
}

function VenuesBlock({ events }: { events: EventsConfig }) {
  if (events.venues.length === 0) {
    return (
      <p className="font-sans text-[14px] leading-relaxed text-[#8A8278]">
        {UI_CONFIG.corporate.venuesUnknown}
      </p>
    );
  }

  return (
    <ul className="space-y-6">
      {events.venues.map((venue, index) => (
        <li
          key={`${venue.name}-${index}`}
          className={cn(index > 0 && "border-t border-[#EEEAE3] pt-6")}
        >
          <VenueCard venue={venue} index={index} />
        </li>
      ))}
    </ul>
  );
}

function WeddingBlock({ events }: { events: EventsConfig }) {
  const w = events.wedding;
  const facts: EventsFact[] = [
    {
      label: UI_CONFIG.weddings.ceremonySpot,
      value: formatEventsBool(w.ceremony_spot),
    },
    {
      label: UI_CONFIG.weddings.rainPlan,
      value: formatEventsBool(w.ceremony_rain_plan),
    },
    {
      label: UI_CONFIG.weddings.brideRoom,
      value: formatEventsBool(w.bride_room),
    },
    {
      label: "Свои подрядчики",
      value: formatEventsBool(w.external_vendors_allowed),
    },
    {
      label: "Эксклюзивная дата",
      value: formatEventsBool(w.exclusive_date),
    },
    {
      label: "Комендантский час",
      value: formatEventsNullable(w.noise_curfew),
    },
  ];

  return (
    <FactList
      facts={facts}
      note={
        w.photo_spots.trim()
          ? `${UI_CONFIG.weddings.photoSpots}: ${w.photo_spots.trim()}`
          : undefined
      }
    />
  );
}

function ActivitiesChips({ activities }: { activities: string[] }) {
  return (
    <div className="flex flex-wrap content-start gap-3">
      {activities.map((item) => (
        <span
          key={item}
          className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-[#F0EBE3] px-3.5 font-sans text-[14px] leading-none text-[#2C3228] md:text-[15px]"
        >
          <Icon
            name={activityIcon(item)}
            size={22}
            className="text-[#6B635A]"
          />
          {item}
        </span>
      ))}
    </div>
  );
}

export function EventsDetailSections({
  object,
  showWedding = false,
  afterVenues,
}: {
  object: BaseObject;
  showWedding?: boolean;
  afterVenues?: ReactNode;
}) {
  const events = object.events;
  const copy = UI_CONFIG.corporate.page;

  if (!events) {
    return (
      <div className="space-y-4 md:space-y-5">
        <Tile title={copy.venuesTitle}>
          <p className="font-sans text-[14px] leading-relaxed text-[#8A8278]">
            {copy.emptyEvents}
          </p>
        </Tile>
        {afterVenues}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-5">
      {showWedding ? (
        <Tile title={UI_CONFIG.weddings.page.weddingTitle}>
          <WeddingBlock events={events} />
        </Tile>
      ) : null}

      <Tile title={copy.venuesTitle} className="md:px-7 md:py-7">
        <VenuesBlock events={events} />
      </Tile>

      {afterVenues}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <Tile title={copy.buyoutTitle}>
          <FactList facts={buyoutFacts(events)} note={events.buyout.note} />
        </Tile>
        <Tile title={copy.sleepingTitle}>
          <FactList
            facts={sleepingFacts(events)}
            note={events.sleeping.note}
          />
        </Tile>
        <Tile title={copy.cateringTitle}>
          <FactList
            facts={cateringFacts(events)}
            note={events.catering.note}
          />
        </Tile>
        <Tile title={copy.equipmentTitle}>
          <FactList
            facts={equipmentFacts(events)}
            note={events.equipment.note}
          />
        </Tile>
        <Tile title={copy.logisticsTitle}>
          <FactList
            facts={logisticsFacts(events)}
            note={events.logistics.note}
          />
        </Tile>
        <Tile title={copy.seasonTitle}>
          <FactList facts={seasonFacts(events)} />
        </Tile>
        <Tile title={copy.legalTitle} className="md:col-span-2">
          <FactList facts={legalFacts(events)} />
        </Tile>
        {events.activities.length > 0 ? (
          <Tile title="Активности на базе" className="md:col-span-2">
            <ActivitiesChips activities={events.activities} />
          </Tile>
        ) : null}
      </div>
    </div>
  );
}
