import { UI_CONFIG } from "@/config/uiConfig";
import type { BaseObject } from "@/types";

export function TourPlayer({ object }: { object: BaseObject }) {
  const tourUrl = object.tour.url;
  const cover = object.tour.preview || object.photos[0]?.src || "";

  if (!tourUrl) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-stone-200/90 bg-stone-200 shadow-sm">
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
    <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-stone-200/90 bg-stone-900 shadow-sm">
      <iframe
        src={tourUrl}
        title={`${object.name} — ${UI_CONFIG.base.tourBadge}`}
        className="absolute inset-0 h-full w-full border-0"
        allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
