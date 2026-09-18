"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { CatalogMap } from "@/components/catalog/catalog-map";
import {
  EventsListingCard,
  type EventsSectionVariant,
} from "@/components/events/events-listing-card";
import { Typography } from "@/components/ui/typography";
import { UI_CONFIG } from "@/config/uiConfig";
import {
  EVENTS_CAPACITY_FILTERS,
  WEDDING_FEATURE_FILTERS,
  getEventsCapacityMax,
  matchesEventsCapacityFilter,
  matchesWeddingFeatureFilters,
  type EventsCapacityFilterSlug,
  type WeddingFeatureFilterSlug,
} from "@/lib/object-events";
import type { BaseObject } from "@/types";
import { cn } from "@/lib/utils";

const cardMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

type CapacitySelection = EventsCapacityFilterSlug | "all";
type ViewMode = "list" | "map";

function sectionCopy(variant: EventsSectionVariant) {
  return variant === "weddings" ? UI_CONFIG.weddings : UI_CONFIG.corporate;
}

export function EventsCatalogCanvas({
  objects,
  variant = "corporate",
}: {
  objects: BaseObject[];
  variant?: EventsSectionVariant;
}) {
  const [capacity, setCapacity] = useState<CapacitySelection>("all");
  const [weddingFeatures, setWeddingFeatures] = useState<
    WeddingFeatureFilterSlug[]
  >([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const copy = sectionCopy(variant);
  const isWeddings = variant === "weddings";

  const filtered = useMemo(() => {
    return objects.filter((object) => {
      if (capacity !== "all") {
        if (
          !matchesEventsCapacityFilter(getEventsCapacityMax(object), capacity)
        ) {
          return false;
        }
      }
      if (isWeddings && weddingFeatures.length > 0) {
        if (!matchesWeddingFeatureFilters(object, weddingFeatures)) {
          return false;
        }
      }
      return true;
    });
  }, [objects, capacity, weddingFeatures, isWeddings]);

  function resetFilters() {
    setCapacity("all");
    setWeddingFeatures([]);
  }

  function toggleWeddingFeature(slug: WeddingFeatureFilterSlug) {
    setWeddingFeatures((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]
    );
  }

  return (
    <div
      className={cn(
        "mx-auto w-full px-4 pt-8 md:px-[5vw] md:pt-10",
        viewMode === "map" ? "pb-0" : "pb-16 md:pb-20"
      )}
    >
      <div className="mb-6 flex flex-col gap-4 border-b border-[#1A241C]/10 pb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Typography
              variant="caption"
              className="font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-[#5A635C]"
            >
              {copy.capacityFilter}
            </Typography>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label={copy.capacityFilter}
            >
              <FilterChip
                label={copy.capacityAll}
                active={capacity === "all"}
                onClick={() => setCapacity("all")}
              />
              {EVENTS_CAPACITY_FILTERS.map((item) => (
                <FilterChip
                  key={item.slug}
                  label={item.label}
                  active={capacity === item.slug}
                  onClick={() => setCapacity(item.slug)}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <Typography
              variant="caption"
              className="font-sans text-[12px] font-medium tracking-wide text-[#5A635C]"
            >
              {viewMode === "list"
                ? UI_CONFIG.filters.list
                : UI_CONFIG.filters.map}
            </Typography>
            <ViewToggle
              checked={viewMode === "map"}
              onChange={() =>
                setViewMode((prev) => (prev === "list" ? "map" : "list"))
              }
              label={UI_CONFIG.filters.viewMode}
            />
          </div>
        </div>

        {isWeddings ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <Typography
              variant="caption"
              className="shrink-0 pt-2 font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-[#5A635C]"
            >
              {copy.weddingFilters}
            </Typography>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label={copy.weddingFilters}
            >
              {WEDDING_FEATURE_FILTERS.map((item) => (
                <FilterChip
                  key={item.slug}
                  label={item.label}
                  active={weddingFeatures.includes(item.slug)}
                  onClick={() => toggleWeddingFeature(item.slug)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#1A241C]/15 bg-white/60 px-6 py-14 text-center">
          <Typography
            variant="h3"
            className="font-sans text-lg font-semibold text-[#1A241C]"
          >
            {copy.empty}
          </Typography>
          <Typography
            variant="body"
            className="mx-auto mt-2 max-w-md text-[14px] text-[#5A635C]"
          >
            {copy.emptySubtitle}
          </Typography>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8A6A2E] transition-colors hover:text-[#6B5220]"
          >
            {copy.emptyReset}
          </button>
        </div>
      ) : viewMode === "map" ? (
        <>
          <CatalogMap objects={filtered} variant={variant} />
          <div className="h-[15vh] md:h-[17vh]" aria-hidden />
        </>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((object) => (
              <motion.li
                key={object.slug}
                layout
                {...cardMotion}
                className="list-none"
              >
                <EventsListingCard object={object} variant={variant} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-md border px-3.5 py-2 font-sans text-[13px] font-medium tracking-wide transition-colors",
        active
          ? "border-[#1A241C] bg-[#1A241C] text-[#F5F6F4]"
          : "border-transparent bg-[#F0EBE3] text-[#6B635A] hover:bg-[#E8E0D4]"
      )}
    >
      {label}
    </button>
  );
}

function ViewToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors",
        checked ? "bg-[#1A241C]" : "bg-[#C5CBC5]"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform",
          checked ? "left-[1.125rem]" : "left-0.5"
        )}
      />
    </button>
  );
}
