import type { BaseObject } from "@/types";

/** На витрине всё, кроме draft. */
export function isObjectListed(object: Pick<BaseObject, "status">): boolean {
  return object.status !== "draft";
}

/**
 * B2B-витрина (мероприятия / свадьбы): только явно подходящие объекты.
 * suitable === null | false или нет блока events — не показываем.
 */
export function isObjectListedForEvents(
  object: Pick<BaseObject, "status" | "events">
): boolean {
  return isObjectListed(object) && object.events?.suitable === true;
}

/** Удобство явно есть. */
export function hasAmenityFlag(value: boolean | null | undefined): boolean {
  return value === true;
}

/** Аудитория подходит (fit === true). null — не фильтруем как «да». */
export function isSuitableFit(fit: boolean | null): boolean {
  return fit === true;
}
