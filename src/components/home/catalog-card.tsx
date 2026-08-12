import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { UI_CONFIG } from "@/config/uiConfig";
import type { BaseObject } from "@/types";
import { cn } from "@/lib/utils";

export type CatalogCardVariant = "default" | "short";

type CatalogCardProps = {
  object: BaseObject;
  variant?: CatalogCardVariant;
  className?: string;
};

function formatPrice(object: BaseObject) {
  return `${UI_CONFIG.base.pricePrefix} ${object.price.from.toLocaleString("ru-RU")} ₽/${object.price.unit}`;
}

function coverSrc(object: BaseObject) {
  return object.tour.preview || object.photos[0]?.src || "";
}

function CoverImage({ object, src }: { object: BaseObject; src: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={object.name}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div
      className="h-full w-full bg-[linear-gradient(145deg,#c5bfb2_0%,#8a9a8e_50%,#5c6b6e_100%)]"
      aria-hidden
    />
  );
}

function CatalogCard({
  object,
  variant = "default",
  className,
}: CatalogCardProps) {
  const src = coverSrc(object);
  const hasTour = Boolean(object.tour?.url);

  if (variant === "short") {
    return (
      <Link
        href={`/base/${object.slug}`}
        className={cn("group block", className)}
      >
        <Card
          className={cn(
            "surface-card surface-card-interactive relative h-[88px] overflow-hidden rounded-xl p-0 md:h-[100px]"
          )}
        >
          <CoverImage object={object} src={src} />
          {hasTour ? (
            <Badge
              variant="tour"
              text={UI_CONFIG.common.tourBadge}
              className="absolute bottom-1.5 right-1.5 z-10 scale-75"
            />
          ) : null}
        </Card>
      </Link>
    );
  }

  return (
    <Link
      href={`/base/${object.slug}`}
      className={cn("group block", className)}
    >
      <Card
        className={cn(
          "surface-card surface-card-interactive flex flex-col overflow-hidden rounded-2xl p-0"
        )}
      >
        <div className="relative h-[120px] overflow-hidden bg-gradient-to-br from-[#d4cfc4] via-[#c5bfb2] to-[#a8b0a4] shimmer md:h-[132px]">
          <CoverImage object={object} src={src} />
          {hasTour ? (
            <Badge
              variant="tour"
              text={UI_CONFIG.common.tourBadge}
              className="absolute bottom-2 right-2 z-10 scale-90"
            />
          ) : null}
        </div>

        <div className="flex flex-col px-3 pb-3 pt-2.5">
          <Typography
            variant="h3"
            className="text-sm font-semibold leading-snug text-[#1A241C] md:text-[15px]"
          >
            {object.name}
          </Typography>
          <Typography
            variant="caption"
            className="mt-1 block text-xs font-semibold text-[#1A241C]"
          >
            {formatPrice(object)}
          </Typography>
          <span className="btn-tactile mt-2.5 inline-flex h-8 w-fit items-center justify-center rounded-xl border border-[#BC5434]/20 bg-gradient-to-b from-[#c86648] to-[#a8482c] px-4 text-[11px] leading-none text-white shadow-[0_3px_12px_rgba(188,84,52,0.24)] md:text-xs">
            {UI_CONFIG.common.bookCta}
          </span>
        </div>
      </Card>
    </Link>
  );
}

export { CatalogCard };
