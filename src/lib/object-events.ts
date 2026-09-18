import type { BaseObject, EventsConfig } from "@/types";
import { isObjectListed } from "@/lib/object-flags";

/** Корзины фильтра вместимости (организатор ищет по числу гостей). */
export const EVENTS_CAPACITY_FILTERS = [
  { slug: "to-15", label: "до 15", max: 15 },
  { slug: "to-40", label: "до 40", max: 40 },
  { slug: "from-100", label: "100+", min: 100 },
] as const;

export type EventsCapacityFilterSlug =
  (typeof EVENTS_CAPACITY_FILTERS)[number]["slug"];

/**
 * Оценка вместимости для B2B-карточки и фильтра.
 *
 * Приоритет (первое ненулевое):
 * 1) max по venues[].capacity (theatre / banquet / buffet / classroom)
 * 2) sleeping.beds_total
 * 3) sleeping.beds_single_occupancy
 * 4) buyout.min_guests
 *
 * null — данных ещё нет; объект может быть в каталоге, но не матчится по корзинам.
 */
export function getEventsCapacityMax(
  object: Pick<BaseObject, "events">
): number | null {
  const events = object.events;
  if (!events) return null;

  let venueMax: number | null = null;
  for (const venue of events.venues) {
    const values = [
      venue.capacity.theatre,
      venue.capacity.banquet,
      venue.capacity.buffet,
      venue.capacity.classroom,
    ];
    for (const value of values) {
      if (typeof value === "number" && value > 0) {
        venueMax = venueMax == null ? value : Math.max(venueMax, value);
      }
    }
  }
  if (venueMax != null) return venueMax;

  if (
    typeof events.sleeping.beds_total === "number" &&
    events.sleeping.beds_total > 0
  ) {
    return events.sleeping.beds_total;
  }
  if (
    typeof events.sleeping.beds_single_occupancy === "number" &&
    events.sleeping.beds_single_occupancy > 0
  ) {
    return events.sleeping.beds_single_occupancy;
  }
  if (
    typeof events.buyout.min_guests === "number" &&
    events.buyout.min_guests > 0
  ) {
    return events.buyout.min_guests;
  }

  return null;
}

/** Есть ли зачаток events-данных для MVP-витрины (пока suitable не заполнен). */
export function hasEventsPreviewSignal(
  events: EventsConfig | undefined
): boolean {
  if (!events) return false;
  if (events.venues.length > 0) return true;
  if (events.buyout.available === true) return true;
  if (events.sleeping.beds_total != null) return true;
  if (events.sleeping.beds_single_occupancy != null) return true;
  if (events.activities.length > 0) return true;
  if (events.legal.cashless === true) return true;
  if (events.legal.works_with_legal_entity === true) return true;
  if (events.sleeping.note.trim().length > 0) return true;
  return false;
}

/**
 * B2B-витрина «Мероприятия».
 * - suitable === false → скрыть
 * - suitable === true → показать (если не draft)
 * - suitable === null → MVP: показать при наличии events-сигнала
 */
export function isObjectListedForEvents(
  object: Pick<BaseObject, "status" | "events">
): boolean {
  if (!isObjectListed(object)) return false;
  const suitable = object.events?.suitable;
  if (suitable === false) return false;
  if (suitable === true) return true;
  return hasEventsPreviewSignal(object.events);
}

/** Корзина вместимости (взаимоисключающие диапазоны). */
export function matchesEventsCapacityFilter(
  capacity: number | null,
  slug: EventsCapacityFilterSlug
): boolean {
  if (capacity == null) return false;
  if (slug === "to-15") return capacity <= 15;
  if (slug === "to-40") return capacity > 15 && capacity <= 40;
  return capacity >= 100;
}

export function hasAerialPanorama(
  object: Pick<BaseObject, "tour">
): boolean {
  const features = object.tour.features?.toLowerCase() ?? "";
  return features.includes("аэропанорам");
}

export function formatEventsCapacityLabel(capacity: number | null): string | null {
  if (capacity == null) return null;
  return `до ${capacity} гостей`;
}

/** Свадебные фильтры (мультивыбор, AND по явно true). */
export const WEDDING_FEATURE_FILTERS = [
  { slug: "ceremony_spot", label: "Площадка церемонии", field: "ceremony_spot" },
  { slug: "ceremony_rain_plan", label: "План на дождь", field: "ceremony_rain_plan" },
  { slug: "bride_room", label: "Комната невесты", field: "bride_room" },
  {
    slug: "external_vendors",
    label: "Свои подрядчики",
    field: "external_vendors_allowed",
  },
  { slug: "exclusive_date", label: "Эксклюзивная дата", field: "exclusive_date" },
] as const;

export type WeddingFeatureFilterSlug =
  (typeof WEDDING_FEATURE_FILTERS)[number]["slug"];

/** Есть ли зачаток wedding-данных. */
export function hasWeddingPreviewSignal(
  events: EventsConfig | undefined
): boolean {
  if (!events) return false;
  const w = events.wedding;
  if (w.ceremony_spot === true) return true;
  if (w.ceremony_rain_plan === true) return true;
  if (w.bride_room === true) return true;
  if (w.external_vendors_allowed === true) return true;
  if (w.exclusive_date === true) return true;
  if (w.photo_spots.trim().length > 0) return true;
  if ((w.noise_curfew ?? "").trim().length > 0) return true;
  return false;
}

/**
 * Витрина «Свадьбы».
 * - suitable === false → скрыть
 * - wedding-сигнал → показать
 * - MVP: иначе как events-витрина (пока wedding почти пустой)
 */
export function isObjectListedForWeddings(
  object: Pick<BaseObject, "status" | "events">
): boolean {
  if (!isObjectListed(object)) return false;
  const suitable = object.events?.suitable;
  if (suitable === false) return false;
  if (hasWeddingPreviewSignal(object.events)) return true;
  return hasEventsPreviewSignal(object.events);
}

export function matchesWeddingFeatureFilters(
  object: Pick<BaseObject, "events">,
  slugs: readonly WeddingFeatureFilterSlug[]
): boolean {
  if (slugs.length === 0) return true;
  const wedding = object.events?.wedding;
  if (!wedding) return false;

  for (const slug of slugs) {
    const filter = WEDDING_FEATURE_FILTERS.find((item) => item.slug === slug);
    if (!filter) return false;
    if (wedding[filter.field] !== true) return false;
  }
  return true;
}

export function formatWeddingBool(
  value: boolean | null,
  unknownLabel = "Уточняется"
): string {
  if (value === true) return "Да";
  if (value === false) return "Нет";
  return unknownLabel;
}

