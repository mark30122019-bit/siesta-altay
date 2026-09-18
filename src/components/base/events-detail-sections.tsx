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

const FACT_HINTS: Record<string, string> = {
  "Выкуп целиком": "Можно ли забронировать базу или площадку целиком под ваше мероприятие.",
  "Мин. гостей": "Минимальное число гостей для выкупа или тарифа.",
  "Мин. ночей": "Сколько ночей нужно забронировать минимум.",
  "Всего спальных мест": "Сколько человек можно разместить на ночёвку.",
  "По одному в номере": "Есть ли размещение по одному человеку в номере или домике.",
  "Своя кухня": "Можно ли готовить самостоятельно на территории.",
  "Банкетное меню": "Есть ли готовое банкетное или фуршетное меню от базы.",
  "Внешний кейтеринг": "Можно ли привезти своего кейтерера.",
  Проектор: "Есть ли проектор для презентаций и показов.",
  Экран: "Есть ли экран для проекции.",
  Звук: "Есть ли звуковая система в зале.",
  Микрофоны: "Есть ли микрофоны для выступлений.",
  Сцена: "Есть ли сцена или подиум.",
  "Питание на улице": "Можно ли организовать питание на открытом воздухе.",
  "Wi‑Fi для конференции": "Достаточно ли стабильный интернет для онлайн-подключений.",
  "Подъезд автобуса": "Может ли автобус подъехать к территории.",
  "Разворот автобуса": "Есть ли место для разворота большого транспорта.",
  "Парковка (авто)": "Сколько машин помещается на парковке.",
  Дорога: "Какой подъезд к базе — асфальт, грунт и т.п.",
  "От Новосибирска, ч": "Примерное время в пути от Новосибирска.",
  "Круглый год": "Работает ли площадка зимой и летом.",
  "Зимние мероприятия": "Подходит ли база для зимних выездов.",
  "Отапливаемые залы": "Есть ли отопление в залах в холодный сезон.",
  "Работа с юрлицом": "Можно ли заключить договор с компанией.",
  Безнал: "Принимают ли безналичную оплату.",
  НДС: "Работает ли база с НДС.",
  "Закрывающие документы": "Выдают ли акты и закрывающие документы.",
  [UI_CONFIG.weddings.ceremonySpot]: "Есть ли место для выездной церемонии.",
  [UI_CONFIG.weddings.rainPlan]: "Есть ли запасной вариант, если пойдёт дождь.",
  [UI_CONFIG.weddings.brideRoom]: "Есть ли отдельная комната для сборов невесты.",
  "Свои подрядчики": "Можно ли привести своих фотографа, ведущего, кейтеринг.",
  "Эксклюзивная дата": "Можно ли выкупить дату только под вашу свадьбу.",
  "Комендантский час": "До скольки можно шуметь музыкой вечером.",
};

const SUMMARY_HINTS: Record<string, string> = {
  Зал: "Главный зал или площадка для мероприятия.",
  Спальные: "Сколько гостей можно разместить на ночь.",
  Выкуп: "Доступен ли выкуп объекта целиком.",
  Безнал: "Принимают ли оплату по безналу.",
  Автобус: "Удобен ли подъезд автобуса.",
  Сезон: "В какие сезоны площадка принимает гостей.",
};

function factHint(label: string): string {
  return FACT_HINTS[label] ?? `Подробности по пункту «${label}».`;
}

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
      className="events-summary px-3 py-3 md:px-4 md:py-3.5"
      aria-label="Ключевые факты"
    >
      <ul className="events-summary-grid grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0">
        {items.map((item) => (
          <li
            key={item.label}
            title={SUMMARY_HINTS[item.label] ?? item.label}
            className="flex min-w-0 flex-col gap-1 rounded-xl px-2.5 py-2.5 lg:rounded-none lg:px-3.5"
          >
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-700">
              {item.label}
            </span>
            <span
              className={cn(
                "truncate font-sans text-[14px] leading-snug md:text-[15px]",
                item.known
                  ? "font-semibold tracking-[-0.01em] text-[#1A241C]"
                  : "font-normal text-neutral-600"
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
  tone = "default",
}: {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: IconName;
  tone?: "default" | "wedding";
}) {
  const sectionIcon = icon ?? SECTION_ICONS[title];
  const isWedding = tone === "wedding";

  return (
    <section
      className={cn(
        "events-tile flex h-full flex-col px-5 py-5 md:px-6 md:py-6",
        isWedding && "events-tile--wedding",
        className
      )}
    >
      <h3
        className={cn(
          "relative mb-5 flex items-center gap-3 font-serif text-[1.05rem] font-normal tracking-wide md:mb-6 md:text-[1.15rem]",
          isWedding ? "text-[#6B3A32]" : "text-[#1A241C]"
        )}
      >
        {sectionIcon ? (
          <span className="events-tile-icon">
            <Icon name={sectionIcon} size={22} />
          </span>
        ) : null}
        <span className="min-w-0 leading-snug">{title}</span>
      </h3>
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  );
}

function FactValue({ value }: { value: string }) {
  const unknown = isUnknownValue(value);
  return (
    <span
      className={cn(
        "block text-right font-sans text-[13px] leading-snug md:text-[14px]",
        unknown
          ? "font-normal text-neutral-400"
          : "font-semibold tracking-[-0.01em] text-[#1A241C]"
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
    <div className="flex min-h-0 flex-1 flex-col">
      <dl className="events-fact-list -mx-1.5">
        {facts.map((fact) => {
          const icon = icons?.[fact.label] ?? FACT_ICONS[fact.label];
          return (
            <div
              key={fact.label}
              title={factHint(fact.label)}
              className="events-fact-row flex items-center justify-between gap-4 py-3 first:pt-1.5 last:pb-1.5"
            >
              <dt className="flex min-w-0 flex-1 items-center gap-2.5 font-sans text-[13px] leading-none text-[#5C574F] md:text-[14px]">
                {icon ? (
                  <span className="fact-icon size-8 shrink-0">
                    <Icon name={icon} size={16} />
                  </span>
                ) : null}
                <span className="min-w-0 text-left">{fact.label}</span>
              </dt>
              <dd className="shrink-0 self-center">
                <FactValue value={fact.value} />
              </dd>
            </div>
          );
        })}
      </dl>
      {note?.trim() ? (
        <p className="mt-auto pt-4 font-sans text-[13px] leading-relaxed text-[#5C574F] md:text-[14px]">
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
    <span className="fact-icon size-9 font-sans text-[13px] font-semibold tabular-nums md:text-[14px]">
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
          <h4 className="font-serif text-[1.15rem] font-normal leading-snug tracking-wide text-[#1A241C] md:text-[1.25rem]">
            {venue.name}
          </h4>
          {meta ? (
            <p className="mt-1 font-sans text-[13px] leading-relaxed text-[#5C574F] md:text-[14px]">
              {meta}
            </p>
          ) : null}
        </div>
      </div>

      <div
        title="Отопление в зале — важно для межсезонья и зимы."
        className="flex items-center gap-2.5 font-sans text-[13px] leading-relaxed text-[#5C574F] md:text-[14px]"
      >
        <span className="fact-icon size-8">
          <Icon name="thermometer" size={16} />
        </span>
        <span>
          {copy.heatedLabel}:{" "}
          <span
            className={cn(
              isUnknownValue(heated)
                ? "font-normal text-neutral-400"
                : "font-semibold text-[#1A241C]"
            )}
          >
            {heated}
          </span>
        </span>
      </div>

      {capacity.length > 0 ? (
        <div
          title="Вместимость по форматам рассадки: театр, банкет, фуршет."
          className="flex items-start gap-2.5 font-sans text-[13px] leading-relaxed text-[#5C574F] md:text-[14px]"
        >
          <span className="fact-icon mt-0.5 size-8">
            <Icon name="users" size={16} />
          </span>
          <span>Рассадка: {capacity.join(" · ")}</span>
        </div>
      ) : null}

      {venue.note.trim() ? (
        <p className="mt-1 font-sans text-[13px] leading-relaxed text-[#5C574F] md:text-[14px] md:leading-[1.65]">
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
          className={cn(index > 0 && "border-t border-[rgba(120,72,40,0.1)] pt-6")}
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
    <div className="flex flex-wrap content-start gap-2.5">
      {activities.map((item) => (
        <span
          key={item}
          title={item}
          className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-[rgba(120,72,40,0.18)] bg-[linear-gradient(180deg,#f7f4ec_0%,#efebe2_100%)] px-3.5 font-sans text-[14px] leading-none text-[#2C3228] md:text-[15px]"
        >
          <Icon
            name={activityIcon(item)}
            size={20}
            className="text-[#5a4638]"
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
        <Tile title={UI_CONFIG.weddings.page.weddingTitle} tone="wedding">
          <WeddingBlock events={events} />
        </Tile>
      ) : null}

      <Tile title={copy.venuesTitle}>
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
