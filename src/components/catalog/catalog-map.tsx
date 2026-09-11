"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { TourIframe } from "@/components/base/tour-iframe";
import { CatalogListingCard } from "@/components/catalog/catalog-listing-card";
import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { YANDEX_MAPS_API_KEY } from "@/config/maps";
import { UI_CONFIG } from "@/config/uiConfig";
import { formatObjectPrice } from "@/lib/object-price";
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
  const [tourOpen, setTourOpen] = useState(false);
  const [tourFullscreen, setTourFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const tourPanelRef = useRef<HTMLDivElement>(null);

  objectsRef.current = objects;

  const placemarkKey = useMemo(
    () => objects.map((item) => item.slug).join("|"),
    [objects]
  );

  const selected = objects.find((item) => item.slug === selectedSlug) ?? null;
  const tourUrl = selected?.tour.url ?? null;

  useEffect(() => {
    if (!selectedSlug) {
      setTourOpen(false);
      setTourFullscreen(false);
      return;
    }
    if (!objects.some((item) => item.slug === selectedSlug)) {
      setSelectedSlug(null);
      setTourOpen(false);
      setTourFullscreen(false);
    }
  }, [objects, selectedSlug]);

  useEffect(() => {
    if (!tourOpen) {
      setTourFullscreen(false);
      if (document.fullscreenElement) {
        void document.exitFullscreen().catch(() => undefined);
      }
    }
  }, [tourOpen]);

  useEffect(() => {
    function onFullscreenChange() {
      setTourFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  async function toggleTourFullscreen() {
    const panel = tourPanelRef.current;
    if (!panel) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await panel.requestFullscreen();
      }
    } catch {
      setTourFullscreen((prev) => !prev);
    }
  }

  function closeSelected() {
    setSelectedSlug(null);
    setTourOpen(false);
    setTourFullscreen(false);
  }

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
          const coords = object.location.coords;
          if (!coords) return;
          const [lat, lng] = coords;
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
              balloonContentBody: [
                object.location.district,
                formatObjectPrice(object),
              ]
                .filter(Boolean)
                .join("<br/>"),
            },
            {
              preset: "islands#brownIcon",
              hideIconOnBalloonOpen: false,
            }
          );

          placemark.events.add("click", () => {
            setSelectedSlug(object.slug);
            setTourOpen(false);
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
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col gap-3 p-3 sm:flex-row sm:items-stretch sm:gap-4 sm:p-5 md:p-6">
          <div
            className={cn(
              "pointer-events-auto relative w-full shrink-0 sm:max-w-[340px] md:max-w-[380px]",
              tourOpen && tourUrl && "hidden sm:block"
            )}
          >
            <div className="catalog-map-card-scroll max-h-[min(70dvh,calc(100dvh-7.5rem))] overflow-x-hidden overflow-y-auto overscroll-contain rounded-xl shadow-[0_20px_50px_rgba(42,36,28,0.18)] sm:max-h-full">
              <CatalogListingCard
                key={selected.slug}
                object={selected}
                mode="map"
                tourOpen={tourOpen}
                onTourToggle={() => {
                  if (!tourUrl) return;
                  setTourOpen((prev) => !prev);
                }}
                onClose={closeSelected}
                className="shadow-none"
              />
            </div>
          </div>

          {tourOpen && tourUrl ? (
            <div
              ref={tourPanelRef}
              className={cn(
                "pointer-events-auto flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-[#1A241C]/55 shadow-[0_24px_60px_rgba(26,36,28,0.35)] backdrop-blur-[6px]",
                tourFullscreen
                  ? "fixed inset-0 z-50 mb-0 rounded-none bg-[#121812]"
                  : "mb-4"
              )}
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3.5 py-2.5 md:px-4">
                <Typography
                  variant="caption"
                  className="min-w-0 truncate text-[12px] font-medium tracking-wide text-white/90 md:text-[13px]"
                >
                  {selected.name}
                  <span className="text-white/50">
                    {" · "}
                    {UI_CONFIG.common.tourBadge}
                  </span>
                </Typography>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => void toggleTourFullscreen()}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/20"
                    aria-label={
                      tourFullscreen
                        ? UI_CONFIG.base.exitFullscreen
                        : UI_CONFIG.base.expandFullscreen
                    }
                  >
                    <Icon
                      name={tourFullscreen ? "compress" : "expand"}
                      size={15}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTourOpen(false)}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/20"
                    aria-label={UI_CONFIG.catalog.closeTour}
                  >
                    <Icon name="close" size={15} />
                  </button>
                </div>
              </div>
              <div className="relative min-h-[52dvh] flex-1 bg-[#121812] sm:min-h-0">
                <TourIframe
                  src={tourUrl}
                  title={`${selected.name} — ${UI_CONFIG.common.tourBadge}`}
                  className="absolute inset-0"
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
