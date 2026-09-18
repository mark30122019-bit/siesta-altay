"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/ui/icon";
import { Typography } from "@/components/ui/typography";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import { assetPath } from "@/config/site";
import { isObjectListed } from "@/lib/object-flags";
import type { BaseObject } from "@/types";
import { cn } from "@/lib/utils";

const VISIBLE = 3;
const SLIDE_MS = 500;

function firstGoodFor(object: BaseObject) {
  const raw =
    object.author.good_for.find((item) => item.trim().length > 0)?.trim() ??
    "";
  if (!raw) return "";
  return raw.charAt(0).toLocaleUpperCase("ru-RU") + raw.slice(1);
}

function coverSrc(object: BaseObject) {
  return object.tour.preview || object.photos[0]?.src || "";
}

function BaseAudienceCard({ object }: { object: BaseObject }) {
  const line = firstGoodFor(object);
  const src = coverSrc(object);

  return (
    <Link
      href={`/base/${object.slug}`}
      className="group relative flex h-full min-h-[230px] flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl px-3.5 py-5 text-center sm:px-4 sm:py-6"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={assetPath(src)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className="absolute inset-0 bg-[linear-gradient(145deg,#c5bfb2_0%,#8a9a8e_50%,#5c6b6e_100%)]"
          aria-hidden
        />
      )}
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,18,0.42)_0%,rgba(18,24,18,0.58)_45%,rgba(18,24,18,0.78)_100%)] transition-[opacity] duration-300 group-hover:opacity-95"
        aria-hidden
      />

      <Typography
        variant="h3"
        className="relative z-10 font-serif text-[14px] font-bold leading-snug tracking-wide text-white sm:text-[15px]"
      >
        {object.name}
      </Typography>

      <Typography
        variant="body"
        className="relative z-10 font-sans text-[13px] font-medium leading-snug text-white/90 sm:text-[14px]"
      >
        {line}
      </Typography>
    </Link>
  );
}

export function CultureSection() {
  const objects = GLOBAL_CONFIG.objects
    .filter(isObjectListed)
    .filter((object) => Boolean(firstGoodFor(object)));

  const count = objects.length;
  const canSlide = count > VISIBLE;
  const perView = Math.min(VISIBLE, Math.max(count, 1));
  const slides = canSlide ? [...objects, ...objects] : objects;

  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const busyRef = useRef(false);
  const reduceMotionRef = useRef(false);

  const [index, setIndex] = useState(0);

  const activeDot = canSlide ? index % count : 0;

  function offsetPercent(slideIndex: number) {
    return (slideIndex / slides.length) * 100;
  }

  function paint(slideIndex: number, animate: boolean) {
    const track = trackRef.current;
    if (!track) return;

    if (!animate || reduceMotionRef.current) {
      track.style.transition = "none";
      track.style.transform = `translate3d(-${offsetPercent(slideIndex)}%, 0, 0)`;
      void track.offsetWidth;
      return;
    }

    track.style.transition = `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    track.style.transform = `translate3d(-${offsetPercent(slideIndex)}%, 0, 0)`;
  }

  function finishMove() {
    let next = indexRef.current;
    if (next >= count) {
      next -= count;
      indexRef.current = next;
      paint(next, false);
      setIndex(next);
    }
    busyRef.current = false;
  }

  function moveBy(steps: number) {
    if (!canSlide || busyRef.current || steps === 0) return;
    busyRef.current = true;

    if (reduceMotionRef.current) {
      const next =
        ((indexRef.current + steps) % count + count) % count;
      indexRef.current = next;
      paint(next, false);
      setIndex(next);
      busyRef.current = false;
      return;
    }

    let from = indexRef.current;

    if (steps < 0) {
      if (from === 0) {
        from = count;
        indexRef.current = count;
        paint(count, false);
      }
      const target = from + steps;
      indexRef.current = target;
      paint(target, true);
      setIndex(target);
      window.setTimeout(finishMove, SLIDE_MS + 30);
      return;
    }

    if (from + steps >= count * 2) {
      from = from % count;
      indexRef.current = from;
      paint(from, false);
    }

    const target = from + steps;
    indexRef.current = target;
    paint(target, true);
    setIndex(target);
    window.setTimeout(finishMove, SLIDE_MS + 30);
  }

  function goToDot(dotIndex: number) {
    if (!canSlide || busyRef.current) return;
    const real = indexRef.current % count;
    if (dotIndex === real) return;
    const forward =
      dotIndex > real ? dotIndex - real : count - real + dotIndex;
    moveBy(forward);
  }

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduceMotionRef.current = media.matches;
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    paint(indexRef.current, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length, perView]);

  if (count === 0) return null;

  return (
    <div className="flex flex-col bg-transparent">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Icon name="mountains" size={20} className="shrink-0 text-[#3A3A34]" />
          <Typography
            variant="h2"
            className="text-base font-bold uppercase leading-snug tracking-[0.04em] text-[#1A241C] md:text-lg"
          >
            {UI_CONFIG.home.cultureTitle}
          </Typography>
        </div>

        {canSlide ? (
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={() => moveBy(-1)}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full text-[#1A241C] transition-colors hover:bg-[#EDE7DC]"
              aria-label="Предыдущая база"
            >
              <Icon name="chevronLeft" size={18} />
            </button>
            <button
              type="button"
              onClick={() => moveBy(1)}
              className="flex size-9 cursor-pointer items-center justify-center rounded-full text-[#1A241C] transition-colors hover:bg-[#EDE7DC]"
              aria-label="Следующая база"
            >
              <Icon name="chevron" size={18} />
            </button>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden bg-transparent">
        <div
          ref={trackRef}
          className="flex bg-transparent will-change-transform"
          style={{
            width: `${(slides.length / perView) * 100}%`,
            transform: `translate3d(0, 0, 0)`,
          }}
        >
          {slides.map((object, slot) => (
            <div
              key={`${object.slug}-${slot}`}
              className="box-border shrink-0 grow-0 px-1 sm:px-1.5"
              style={{ width: `${100 / slides.length}%` }}
            >
              <BaseAudienceCard object={object} />
            </div>
          ))}
        </div>
      </div>

      {canSlide ? (
        <div className="mt-3 flex justify-center gap-1">
          {objects.map((item, dotIndex) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => goToDot(dotIndex)}
              className={cn(
                "flex size-5 cursor-pointer items-center justify-center",
                "after:block after:size-1.5 after:rounded-full after:transition-colors",
                dotIndex === activeDot
                  ? "after:bg-[#1A241C]"
                  : "after:bg-[#1A241C]/20 hover:after:bg-[#1A241C]/45"
              )}
              aria-label={item.name}
              aria-current={dotIndex === activeDot ? "true" : undefined}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
