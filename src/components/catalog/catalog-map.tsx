"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { CatalogListingCard } from "@/components/catalog/catalog-listing-card";
import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { YANDEX_MAPS_API_KEY } from "@/config/maps";
import { UI_CONFIG } from "@/config/uiConfig";
import { loadYandexMaps } from "@/lib/load-yandex-maps";
import type { BaseObject } from "@/types";
import { cn } from "@/lib/utils";

const ALTAI_CENTER: [number, number] = [51.45, 86.0];

const MAP_MARKER_DOTS = [
  { left: "24%", top: "36%" },
  { left: "42%", top: "28%" },
  { left: "58%", top: "44%" },
  { left: "71%", top: "33%" },
  { left: "36%", top: "58%" },
  { left: "63%", top: "62%" },
] as const;

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

function CatalogMapSkeleton() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="absolute inset-0 bg-[linear-gradient(155deg,#e6e1d8_0%,#d4cfc4_42%,#c5bfb2_78%,#b5afa3_100%)] shimmer" />

      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
        aria-hidden
      />

      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.28)_0%,transparent_42%),radial-gradient(circle_at_72%_68%,rgba(248,233,228,0.2)_0%,transparent_38%)]"
        aria-hidden
      />

      {MAP_MARKER_DOTS.map((dot, index) => (
        <span
          key={`${dot.left}-${dot.top}`}
          className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8a7f72]/35 motion-safe:animate-pulse"
          style={{
            left: dot.left,
            top: dot.top,
            animationDelay: `${index * 180}ms`,
          }}
          aria-hidden
        />
      ))}

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex size-16 items-center justify-center rounded-2xl border border-white/45 bg-white/18 shadow-[0_10px_32px_rgba(26,36,28,0.12)] backdrop-blur-[2px] md:size-[4.5rem]">
            <span
              className="absolute inset-0 rounded-2xl border border-white/10"
              aria-hidden
            />
            <span
              className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-white/65 border-r-white/15 motion-safe:animate-spin"
              style={{ animationDuration: "1.6s" }}
              aria-hidden
            />
            <Icon name="map" size={28} className="text-white/90" />
          </div>

          <Typography
            variant="caption"
            className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#6B635A] md:text-[13px]"
          >
            {UI_CONFIG.catalog.mapLoading}
          </Typography>
        </div>
      </div>
    </div>
  );
}

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
    setReady(false);

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
        "surface-card relative mt-6 w-full overflow-hidden rounded-2xl",
        "h-[calc(100dvh-5.5rem)] min-h-[560px]",
        className
      )}
    >
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      {!ready && !error ? <CatalogMapSkeleton /> : null}

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
            <div className="catalog-map-card-scroll max-h-[calc(100dvh-7.5rem)] overflow-x-hidden overflow-y-auto overscroll-contain rounded-xl shadow-[0_20px_50px_rgba(42,36,28,0.18)]">
              <CatalogListingCard
                key={selected.slug}
                object={selected}
                mode="map"
                onClose={() => setSelectedSlug(null)}
                className="shadow-none"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
