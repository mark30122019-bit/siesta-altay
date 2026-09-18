import type { BaseObject } from "@/types";

/** На витрине всё, кроме draft. */
export function isObjectListed(object: Pick<BaseObject, "status">): boolean {
  return object.status !== "draft";
}

/** Удобство явно есть. */
export function hasAmenityFlag(value: boolean | null | undefined): boolean {
  return value === true;
}

/** Аудитория подходит (fit === true). null — не фильтруем как «да». */
export function isSuitableFit(fit: boolean | null): boolean {
  return fit === true;
}

export {
  isObjectListedForEvents,
  isObjectListedForWeddings,
  hasEventsPreviewSignal,
  hasWeddingPreviewSignal,
} from "@/lib/object-events";

