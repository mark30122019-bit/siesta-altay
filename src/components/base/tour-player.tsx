import { UI_CONFIG } from "@/config/uiConfig";
import type { BaseObject } from "@/types";

export function TourPlayer({ object }: { object: BaseObject }) {
  const tourUrl = object.tour.url;
  const cover = object.tour.preview || object.photos[0]?.src || "";

  if (!tourUrl) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[#E8E0D4]/90 bg-[#E8E0D4] shadow-[0_20px_50px_rgba(42,36,28,0.08)]">
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
    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[#E8E0D4]/70 bg-[#2C2925] shadow-[0_20px_50px_rgba(42,36,28,0.1)]">
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
