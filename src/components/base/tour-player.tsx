"use client";

import { useEffect, useRef, useState } from "react";

import { TourIframe } from "@/components/base/tour-iframe";
import { Icon } from "@/components/ui/icon";
import { UI_CONFIG } from "@/config/uiConfig";
import { assetPath } from "@/config/site";
import type { BaseObject } from "@/types";
import { cn } from "@/lib/utils";

export function TourPlayer({
  object,
  locationLine,
}: {
  object: BaseObject;
  locationLine?: string;
}) {
  const tourUrl = object.tour.url;
  const cover = object.tour.preview || object.photos[0]?.src || "";
  const title = `${object.name} — ${UI_CONFIG.common.tourBadge}`;

  const stageRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    function onFullscreenChange() {
      setFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!started && document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
      setFullscreen(false);
    }
  }, [started]);

  async function closeTour() {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        /* ignore */
      }
    }
    setFullscreen(false);
    setStarted(false);
  }

  async function toggleFullscreen() {
    const stage = stageRef.current;
    if (!stage || !started) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setFullscreen(false);
      } else {
        await stage.requestFullscreen();
        setFullscreen(true);
      }
    } catch {
      setFullscreen((prev) => !prev);
    }
  }

  if (!tourUrl) {
    return (
      <div className="space-y-3">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl surface-card">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={assetPath(cover)}
              alt={object.name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        {locationLine ? (
          <p className="inline-flex min-w-0 items-center gap-2 font-sans text-[13px] leading-snug tracking-wide text-[#6B635A] md:text-[14px]">
            <Icon name="map" size={16} className="shrink-0 text-[#8A8278]" />
            <span className="min-w-0">{locationLine}</span>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
            {locationLine ? (
        <div className="flex items-center justify-start gap-4 py-2 px-8">
          <p className="inline-flex min-w-0 items-center gap-2 font-sans text-[20px] leading-snug tracking-wide text-[#6B635A]">
            <Icon name="map" size={16} className="shrink-0 text-[#8A8278]" />
            <span className="min-w-0">{locationLine}</span>
          </p>
        </div>
      ) : null}

      <div
        ref={stageRef}
        className={cn(
          "relative aspect-[16/9] overflow-hidden rounded-2xl surface-card bg-[#121812]",
          fullscreen &&
            "fixed inset-0 z-50 aspect-auto rounded-none bg-[#121812]"
        )}
      >
        {started ? (
          <TourIframe src={tourUrl} title={title} className="absolute inset-0" />
        ) : (
          <>
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={assetPath(cover)}
                alt={object.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 bg-[linear-gradient(160deg,#d4cfc4_0%,#8a9a8e_42%,#5c6b6e_78%,#4a5d4e_100%)]"
                aria-hidden
              />
            )}
            <div className="absolute inset-0 bg-black/20" aria-hidden />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="btn-tactile inline-flex items-center justify-center rounded-xl border border-white/40 bg-[#1A241C]/92 px-5 py-3 font-sans text-[13px] font-semibold tracking-[0.06em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-colors hover:bg-[#1A241C] md:text-sm"
              >
                {UI_CONFIG.base.enter360}
              </button>
            </div>
          </>
        )}

        {started ? (
          <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/65"
              aria-label={
                fullscreen
                  ? UI_CONFIG.base.exitFullscreen
                  : UI_CONFIG.base.openTourFullscreen
              }
            >
              <Icon name={fullscreen ? "compress" : "expand"} size={18} />
            </button>
            <button
              type="button"
              onClick={() => void closeTour()}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/65"
              aria-label={UI_CONFIG.catalog.closeTour}
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        ) : null}
      </div>


    </div>
  );
}
