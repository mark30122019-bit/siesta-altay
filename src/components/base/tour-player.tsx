import { TourIframe } from "@/components/base/tour-iframe";
import { UI_CONFIG } from "@/config/uiConfig";
import type { BaseObject } from "@/types";

export function TourPlayer({ object }: { object: BaseObject }) {
  const tourUrl = object.tour.url;
  const cover = object.tour.preview || object.photos[0]?.src || "";

  if (!tourUrl) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl surface-card">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={object.name}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl surface-card">
      <TourIframe
        src={tourUrl}
        title={`${object.name} — ${UI_CONFIG.common.tourBadge}`}
        className="absolute inset-0"
      />
    </div>
  );
}
