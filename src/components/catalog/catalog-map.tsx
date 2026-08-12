"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { CatalogListingCard } from "@/components/catalog/catalog-listing-card";
import { Typography } from "@/components/ui/typography";
import { YANDEX_MAPS_API_KEY } from "@/config/maps";
import { loadYandexMaps } from "@/lib/load-yandex-maps";
import type { BaseObject } from "@/types";
import { cn } from "@/lib/utils";

const ALTAI_CENTER: [number, number] = [51.45, 86.0];

type CatalogMapProps = {
  objects: BaseObject[];
  className?: string;
};

type YMapWithContainer = {
  destroy: () => void;
  container?: { fitToViewport?: () => void };
  geoObjects: {
    add: (obj: unknown) => void;
    getBounds: () => number[][] | null;
  };
  setBounds: (
    bounds: number[][],
    options?: { checkZoomRange?: boolean; zoomMargin?: number | number[] }
  ) => void;
};

export function CatalogMap({ objects, className }: CatalogMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<YMapWithContainer | null>(null);
  const objectsRef = useRef(objects);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  objectsRef.current = objects;

  const placemarkKey = useMemo(
    () => objects.map((item) => item.slug).join("|"),
    [objects]
  );

  const selected = objects.find((item) => item.slug === selectedSlug) ?? null;

  useEffect(() => {
    if (!selectedSlug) return;
    if (!objects.some((item) => item.slug === selectedSlug)) {
      setSelectedSlug(null);
    }
  }, [objects, selectedSlug]);

  useEffect(() => {
    let cancelled = false;

    if (!YANDEX_MAPS_API_KEY) {
      setError("Не задан ключ Яндекс.Карт");
      return;
    }

    loadYandexMaps(YANDEX_MAPS_API_KEY)
      .then((ymaps) => {
        if (cancelled || !containerRef.current) return;

        if (mapRef.current) {
          mapRef.current.destroy();
          mapRef.current = null;
        }

        const map = new ymaps.Map(
          containerRef.current,
          {
            center: ALTAI_CENTER,
            zoom: 8,
            controls: ["zoomControl", "geolocationControl"],
          },
          { suppressMapOpenBlock: true }
        ) as unknown as YMapWithContainer;

        mapRef.current = map;
        setReady(true);
        setError(null);

        objectsRef.current.forEach((object) => {
          const [lat, lng] = object.location.coords;
          if (
            typeof lat !== "number" ||
            typeof lng !== "number" ||
            Number.isNaN(lat) ||
            Number.isNaN(lng)
          ) {
            return;
          }

          const placemark = new ymaps.Placemark(
            [lat, lng],
            {
              hintContent: object.name,
              balloonContentHeader: object.name,
              balloonContentBody: `${object.location.district}<br/>от ${object.price.from.toLocaleString("ru-RU")} ₽`,
            },
            {
              preset: "islands#brownIcon",
              hideIconOnBalloonOpen: false,
            }
          );

          placemark.events.add("click", () => {
            setSelectedSlug(object.slug);
          });

          map.geoObjects.add(placemark);
        });

        const bounds = map.geoObjects.getBounds();
        if (bounds) {
          map.setBounds(bounds, {
            checkZoomRange: true,
            zoomMargin: [64, 64, 64, 64],
          });
        }

        requestAnimationFrame(() => {
          map.container?.fitToViewport?.();
        });
      })
      .catch(() => {
        if (!cancelled) {
          setError("Не удалось загрузить Яндекс.Карту");
        }
      });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [placemarkKey]);

  useEffect(() => {
    const onResize = () => {
      mapRef.current?.container?.fitToViewport?.();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      className={cn(
        "relative mt-6 w-full overflow-hidden rounded-xl border border-[#E8E0D4]/90 bg-[#f8f8f0] shadow-[0_16px_48px_rgba(42,36,28,0.045)]",
        "h-[calc(100dvh-5.5rem)] min-h-[560px]",
        className
      )}
    >
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      {!ready && !error ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#f8f8f0]/80">
          <Typography variant="caption" className="text-[#6B635A]">
            Загружаем карту…
          </Typography>
        </div>
      ) : null}

      {error ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f8f8f0] px-6 text-center">
          <Typography variant="body" className="text-[#555]">
            {error}
          </Typography>
        </div>
      ) : null}

      {selected ? (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center p-3 sm:items-center sm:justify-start sm:p-5 md:p-6">
          <div className="pointer-events-auto relative w-full max-w-[400px]">
            <button
              type="button"
              onClick={() => setSelectedSlug(null)}
              className="absolute -right-1 -top-1 z-30 flex size-8 items-center justify-center rounded-full border border-[#E8E0D4] bg-white font-sans text-lg leading-none text-[#1A241C] shadow-sm hover:bg-[#f8f8f0]"
              aria-label="Закрыть"
            >
              ×
            </button>
            <div className="catalog-map-card-scroll max-h-[calc(100dvh-7.5rem)] overflow-y-auto overscroll-contain rounded-xl shadow-[0_20px_50px_rgba(42,36,28,0.18)]">
              <CatalogListingCard
                key={selected.slug}
                object={selected}
                mode="map"
                className="shadow-none"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
