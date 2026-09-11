import type { BaseObject, PriceConfig } from "@/types";

/** Цена есть и её можно показывать на сайте. */
export function hasObjectPrice(
  object: Pick<BaseObject, "price">
): object is BaseObject & { price: PriceConfig } {
  return (
    object.price != null &&
    typeof object.price.from === "number" &&
    Number.isFinite(object.price.from) &&
    object.price.from > 0
  );
}

export function formatObjectPrice(object: Pick<BaseObject, "price">): string | null {
  if (!hasObjectPrice(object)) return null;
  return `от ${object.price.from.toLocaleString("ru-RU")} ₽/${object.price.unit}`;
}
