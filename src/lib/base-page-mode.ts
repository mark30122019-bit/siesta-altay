import type { BaseObject, EventsConfig, EventsVenue } from "@/types";
import { UI_CONFIG } from "@/config/uiConfig";

export type BasePageMode = "leisure" | "events" | "weddings";

export function parseBasePageMode(
  value: string | null | undefined
): BasePageMode {
  if (value === "events") return "events";
  if (value === "weddings") return "weddings";
  return "leisure";
}

export function isEventsLikeMode(mode: BasePageMode): boolean {
  return mode === "events" || mode === "weddings";
}

export function formatEventsBool(
  value: boolean | null | undefined,
  unknown = UI_CONFIG.corporate.capacityUnknown
): string {
  if (value === true) return "Да";
  if (value === false) return "Нет";
  return unknown;
}

export function formatEventsNullable(
  value: string | number | null | undefined,
  unknown = UI_CONFIG.corporate.capacityUnknown
): string {
  if (value == null) return unknown;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : unknown;
  }
  return String(value);
}

export function venueCapacityLines(venue: EventsVenue): string[] {
  const lines: string[] = [];
  const { capacity } = venue;
  if (capacity.theatre != null) lines.push(`театр: ${capacity.theatre}`);
  if (capacity.banquet != null) lines.push(`банкет: ${capacity.banquet}`);
  if (capacity.buffet != null) lines.push(`фуршет: ${capacity.buffet}`);
  if (capacity.classroom != null) lines.push(`класс: ${capacity.classroom}`);
  return lines;
}

export type EventsFact = { label: string; value: string };

export function sleepingFacts(events: EventsConfig): EventsFact[] {
  return [
    {
      label: "Всего спальных мест",
      value: formatEventsNullable(events.sleeping.beds_total),
    },
    {
      label: "По одному в номере",
      value: formatEventsNullable(events.sleeping.beds_single_occupancy),
    },
  ];
}

export function cateringFacts(events: EventsConfig): EventsFact[] {
  return [
    {
      label: "Своя кухня",
      value: formatEventsBool(events.catering.own_kitchen),
    },
    {
      label: "Банкетное меню",
      value: formatEventsBool(events.catering.banquet_menu),
    },
    {
      label: "Внешний кейтеринг",
      value: formatEventsBool(events.catering.external_catering_allowed),
    },
  ];
}

export function equipmentFacts(events: EventsConfig): EventsFact[] {
  return [
    { label: "Проектор", value: formatEventsBool(events.equipment.projector) },
    { label: "Экран", value: formatEventsBool(events.equipment.screen) },
    { label: "Звук", value: formatEventsBool(events.equipment.sound) },
    {
      label: "Микрофоны",
      value: formatEventsBool(events.equipment.microphones),
    },
    { label: "Сцена", value: formatEventsBool(events.equipment.stage) },
    {
      label: "Питание на улице",
      value: formatEventsBool(events.equipment.outdoor_power),
    },
    {
      label: "Wi‑Fi для конференции",
      value: formatEventsBool(events.equipment.wifi_for_conference),
    },
  ];
}

export function logisticsFacts(events: EventsConfig): EventsFact[] {
  return [
    {
      label: "Подъезд автобуса",
      value: formatEventsBool(events.logistics.bus_access),
    },
    {
      label: "Разворот автобуса",
      value: formatEventsBool(events.logistics.bus_turnaround),
    },
    {
      label: "Парковка (авто)",
      value: formatEventsNullable(events.logistics.parking_cars),
    },
    {
      label: "Дорога",
      value: formatEventsNullable(events.logistics.road_quality),
    },
    {
      label: "От Новосибирска, ч",
      value: formatEventsNullable(events.logistics.from_novosibirsk_hours),
    },
  ];
}

export function seasonFacts(events: EventsConfig): EventsFact[] {
  return [
    {
      label: "Круглый год",
      value: formatEventsBool(events.season.year_round),
    },
    {
      label: "Зимние мероприятия",
      value: formatEventsBool(events.season.winter_events),
    },
    {
      label: "Отапливаемые залы",
      value: formatEventsBool(events.season.heated_venues),
    },
  ];
}

export function legalFacts(events: EventsConfig): EventsFact[] {
  return [
    {
      label: "Работа с юрлицом",
      value: formatEventsBool(events.legal.works_with_legal_entity),
    },
    { label: "Безнал", value: formatEventsBool(events.legal.cashless) },
    { label: "НДС", value: formatEventsBool(events.legal.vat) },
    {
      label: "Закрывающие документы",
      value: formatEventsBool(events.legal.closing_documents),
    },
  ];
}

export function buyoutFacts(events: EventsConfig): EventsFact[] {
  return [
    {
      label: "Выкуп целиком",
      value: formatEventsBool(events.buyout.available),
    },
    {
      label: "Мин. гостей",
      value: formatEventsNullable(events.buyout.min_guests),
    },
    {
      label: "Мин. ночей",
      value: formatEventsNullable(events.buyout.min_nights),
    },
  ];
}

export function objectEventsHref(
  object: Pick<BaseObject, "slug">,
  mode: Extract<BasePageMode, "events" | "weddings">
): string {
  return mode === "weddings"
    ? `/weddings/${object.slug}`
    : `/events/${object.slug}`;
}
