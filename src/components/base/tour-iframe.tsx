"use client";

import { useEffect, useState } from "react";

import { UI_CONFIG } from "@/config/uiConfig";
import { cn } from "@/lib/utils";

const HOLD_AFTER_LOAD_MS = 600;
const FADE_OUT_MS = 700;

type TourIframeProps = {
  src: string;
  title: string;
  className?: string;
};

export function TourIframe({ src, title, className }: TourIframeProps) {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isMaskHidden, setIsMaskHidden] = useState(false);

  useEffect(() => {
    setIsIframeLoaded(false);
    setIsFading(false);
    setIsMaskHidden(false);
  }, [src]);

  useEffect(() => {
    if (!isIframeLoaded) return;

    const holdTimer = window.setTimeout(() => {
      setIsFading(true);
    }, HOLD_AFTER_LOAD_MS);

    return () => window.clearTimeout(holdTimer);
  }, [isIframeLoaded]);

  useEffect(() => {
    if (!isFading) return;

    const hideTimer = window.setTimeout(() => {
      setIsMaskHidden(true);
    }, FADE_OUT_MS);

    return () => window.clearTimeout(hideTimer);
  }, [isFading]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 z-[1] h-full w-full border-0"
        allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsIframeLoaded(true)}
      />

      {!isMaskHidden ? (
        <div
          className={cn(
            "absolute inset-0 z-10 flex items-center justify-center transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            isFading
              ? "pointer-events-none scale-[1.02] opacity-0"
              : "scale-100 opacity-100"
          )}
          aria-hidden={isFading}
          aria-busy={!isIframeLoaded}
          aria-live="polite"
        >
          <div className="absolute inset-0 bg-[linear-gradient(160deg,#d4cfc4_0%,#8a9a8e_42%,#5c6b6e_78%,#4a5d4e_100%)] shimmer" />
          <div
            className="pointer-events-none absolute -left-16 top-1/4 size-48 rounded-full bg-[#E8ECDF]/35 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-12 bottom-1/4 size-56 rounded-full bg-[#F8E9E4]/25 blur-3xl"
            aria-hidden
          />
          <div className="absolute inset-0 motion-safe:animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.14)_48%,rgba(255,255,255,0.02)_100%)]" />

          <div className="relative flex flex-col items-center gap-5 px-6">
            <div className="relative flex size-[5.5rem] items-center justify-center rounded-full border border-white/30 bg-white/10 shadow-[0_12px_40px_rgba(26,36,28,0.18)] backdrop-blur-[3px] md:size-24">
              <span
                className="absolute inset-1 rounded-full border border-white/10"
                aria-hidden
              />
              <span
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/70 border-r-white/20 motion-safe:animate-spin"
                style={{ animationDuration: "1.4s" }}
                aria-hidden
              />
              <span className="font-sans text-[1.65rem] font-semibold tracking-[0.26em] text-white md:text-3xl">
                3D
              </span>
            </div>

            <p className="font-sans text-[13px] font-medium uppercase tracking-[0.22em] text-white/88 md:text-sm">
              {UI_CONFIG.base.tourLoading}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
