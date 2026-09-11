import type { BaseObject, PriceConfig } from "@/types";

/** Цена на витрине: только publish === true и числовой from. */
export function hasObjectPrice(
  object: Pick<BaseObject, "price">
): object is BaseObject & { price: PriceConfig & { from: number } } {
  const price = object.price;
  return (
    price != null &&
    price.publish === true &&
    typeof price.from === "number" &&
    Number.isFinite(price.from) &&
    price.from > 0
  );
}

export function formatObjectPrice(
  object: Pick<BaseObject, "price">
): string | null {
  if (!hasObjectPrice(object)) return null;
  return `от ${object.price.from.toLocaleString("ru-RU")} ₽/${object.price.unit}`;
}
