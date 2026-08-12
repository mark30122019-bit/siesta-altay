"use client";

import {
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { Chip } from "@/components/ui/chip";
import { Slider } from "@/components/ui/slider";
import { Typography } from "@/components/ui/typography";
import { CatalogEmptyState } from "@/components/catalog/catalog-empty-state";
import { CatalogListingCard } from "@/components/catalog/catalog-listing-card";
import { CatalogMap } from "@/components/catalog/catalog-map";
import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";
import {
  buildCatalogHref,
  catalogHrefMatchesSearchParams,
  defaultCatalogFilterState,
  loadCatalogFilterState,
  parseCatalogSearchParams,
  persistCatalogFilterState,
  type CatalogViewMode,
} from "@/lib/catalog-filter-state";
import type { BaseObject } from "@/types";
import { cn } from "@/lib/utils";

type ViewMode = CatalogViewMode;

type FilterSnapshot = {
  audiences: string[];
  districts: string[];
  features: string[];
  priceRange: [number, number];
};

const FILTER_DEBOUNCE_MS = 500;

const cardMotion = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

function FilterCard({
  title,
  children,
  className,
  action,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "catalog-filter-cursor flex h-full flex-col rounded-xl border border-[#E8E0D4]/90 bg-[#f8f8f0] px-3.5 py-3 shadow-[0_16px_48px_rgba(42,36,28,0.045)] md:px-4 md:py-3.5",
        className
      )}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <Typography
          variant="caption"
          className="text-[13px] font-bold tracking-wide text-[#1A241C] md:text-xs"
        >
          {title}
        </Typography>
        {action}
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

function FilterLink({
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
      className={cn(
        "catalog-filter-cursor text-left font-sans text-[13px] leading-snug transition-colors md:text-xs",
        active
          ? "font-semibold text-[#BC5434]"
          : "text-[#555] hover:text-[#1A241C]"
      )}
    >
      {label}
    </button>
  );
}

function ViewToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "catalog-filter-cursor relative h-4 w-7 shrink-0 rounded-full transition-colors",
        checked ? "bg-[#BC5434]" : "bg-stone-300"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-3 rounded-full bg-white shadow-sm transition-transform",
          checked ? "left-3.5" : "left-0.5"
        )}
      />
    </button>
  );
}

function toggleValue(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function matchesDistrict(object: BaseObject, districts: string[]) {
  if (districts.length === 0) return true;
  const hay = object.location.district.toLowerCase();
  return districts.some((slug) => {
    const filter = GLOBAL_CONFIG.filters.districts.find((d) => d.slug === slug);
    if (!filter) return false;
    return hay.includes(filter.label.toLowerCase().slice(0, 5));
  });
}

function matchesFeature(object: BaseObject, features: string[]) {
  if (features.length === 0) return true;
  return features.some((slug) => {
    if (slug === "banya") return object.amenities.banya;
    if (slug === "pool") return object.amenities.pool;
    if (slug === "waterfront") return object.amenities.waterfront;
    if (slug === "winter")
      return object.amenities.year_round || object.location.winter_access;
    if (slug === "pets") return object.amenities.pets;
    return true;
  });
}

function matchesAudience(object: BaseObject, audiences: string[]) {
  if (audiences.length === 0) return true;
  return audiences.some((slug) => {
    if (slug === "with-kids") return object.suitability.family_kids.fit !== "low";
    if (slug === "in-couple") return object.suitability.couples.fit !== "low";
    if (slug === "company") return object.suitability.company.fit !== "low";
    if (slug === "corporate") return object.suitability.corporate.fit !== "low";
    return true;
  });
}

function matchesFilters(object: BaseObject, filters: FilterSnapshot) {
  if (
    object.price.from < filters.priceRange[0] ||
    object.price.from > filters.priceRange[1]
  ) {
    return false;
  }
  if (!matchesAudience(object, filters.audiences)) return false;
  if (!matchesDistrict(object, filters.districts)) return false;
  if (!matchesFeature(object, filters.features)) return false;
  return true;
}

export function CatalogCanvas({ objects }: { objects: BaseObject[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const priceBounds = useMemo(() => {
    const prices = objects.map((object) => object.price.from);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return {
      min: Math.floor(min / 1000) * 1000,
      max: Math.ceil(max / 1000) * 1000,
    };
  }, [objects]);

  const defaultState = useMemo(
    () => defaultCatalogFilterState(priceBounds),
    [priceBounds]
  );

  const parsedFromUrl = useMemo(
    () => parseCatalogSearchParams(searchParams),
    [searchParams]
  );

  const [audiences, setAudiences] = useState(parsedFromUrl.audiences);
  const [districts, setDistricts] = useState(parsedFromUrl.districts);
  const [features, setFeatures] = useState(parsedFromUrl.features);
  const [priceRange, setPriceRange] = useState<[number, number]>(
    defaultState.priceRange
  );
  const [viewMode, setViewMode] = useState<ViewMode>(parsedFromUrl.viewMode);
  const [isPending, startTransition] = useTransition();
  const [priceHydrated, setPriceHydrated] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState<FilterSnapshot>({
    audiences: parsedFromUrl.audiences,
    districts: parsedFromUrl.districts,
    features: parsedFromUrl.features,
    priceRange: defaultState.priceRange,
  });

  const [debouncedPriceRange, setDebouncedPriceRange] = useState<
    [number, number]
  >(defaultState.priceRange);

  useEffect(() => {
    const stored = loadCatalogFilterState(priceBounds);
    const price = stored?.priceRange ?? defaultState.priceRange;

    startTransition(() => {
      setPriceRange(price);
      setDebouncedPriceRange(price);
      setAppliedFilters((prev) => ({ ...prev, priceRange: price }));
      setPriceHydrated(true);
    });
  }, [defaultState.priceRange, priceBounds]);

  useEffect(() => {
    startTransition(() => {
      setAudiences(parsedFromUrl.audiences);
      setDistricts(parsedFromUrl.districts);
      setFeatures(parsedFromUrl.features);
      setViewMode(parsedFromUrl.viewMode);
      setAppliedFilters((prev) => ({
        audiences: parsedFromUrl.audiences,
        districts: parsedFromUrl.districts,
        features: parsedFromUrl.features,
        priceRange: prev.priceRange,
      }));
    });
  }, [parsedFromUrl]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, FILTER_DEBOUNCE_MS);

    return () => window.clearTimeout(handle);
  }, [priceRange]);

  useEffect(() => {
    startTransition(() => {
      setAppliedFilters({
        audiences,
        districts,
        features,
        priceRange: debouncedPriceRange,
      });
    });
  }, [audiences, districts, features, debouncedPriceRange]);

  useEffect(() => {
    if (!priceHydrated) return;

    const href = buildCatalogHref({
      audiences,
      districts,
      features,
      viewMode,
    });

    persistCatalogFilterState(
      {
        audiences,
        districts,
        features,
        priceRange: debouncedPriceRange,
        viewMode,
      },
      priceBounds
    );

    if (!catalogHrefMatchesSearchParams(href, searchParams)) {
      router.replace(href, { scroll: false });
    }
  }, [
    audiences,
    districts,
    features,
    debouncedPriceRange,
    viewMode,
    priceBounds,
    priceHydrated,
    router,
    searchParams,
  ]);

  const filtered = useMemo(
    () => objects.filter((object) => matchesFilters(object, appliedFilters)),
    [objects, appliedFilters]
  );

  const visibleSlugSet = useMemo(
    () => new Set(filtered.map((object) => object.slug)),
    [filtered]
  );

  const visibleCount = filtered.length;

  function resetFilters() {
    setAudiences([]);
    setDistricts([]);
    setFeatures([]);
    setPriceRange(defaultState.priceRange);
    setDebouncedPriceRange(defaultState.priceRange);
    setViewMode("list");
  }

  return (
    <div
      className={cn(
        "px-6 pt-8 pb-[15vh] md:px-[15vw] md:pt-10 md:pb-[17vh]",
        viewMode === "map" && "pb-0 md:pb-0",
        isPending && "opacity-95"
      )}
    >
      <div className="grid grid-cols-1 items-stretch gap-2.5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
        <FilterCard title={UI_CONFIG.filters.forWhom}>
          <div className="flex flex-wrap content-start gap-1.5">
            {GLOBAL_CONFIG.filters.forWhom.map((item) => (
              <Chip
                key={item.slug}
                label={item.label}
                isActive={audiences.includes(item.slug)}
                onClick={() =>
                  setAudiences((prev) => toggleValue(prev, item.slug))
                }
                className={cn(
                  "catalog-filter-cursor rounded-full px-3 py-1.5 text-[13px] md:px-2.5 md:py-1 md:text-xs",
                  !audiences.includes(item.slug) &&
                    "border-transparent bg-[#F0EBE3] text-[#6B635A] hover:bg-[#E8E0D4]"
                )}
              />
            ))}
          </div>
        </FilterCard>

        <FilterCard title={UI_CONFIG.filters.district}>
          <div className="grid grid-cols-2 content-start gap-x-3 gap-y-1">
            {GLOBAL_CONFIG.filters.districts.map((item) => (
              <FilterLink
                key={item.slug}
                label={item.label}
                active={districts.includes(item.slug)}
                onClick={() =>
                  setDistricts((prev) => toggleValue(prev, item.slug))
                }
              />
            ))}
          </div>
        </FilterCard>

        <FilterCard title={UI_CONFIG.filters.features}>
          <div className="grid grid-cols-2 content-start gap-x-3 gap-y-1">
            {GLOBAL_CONFIG.filters.features.map((item) => (
              <FilterLink
                key={item.slug}
                label={item.label}
                active={features.includes(item.slug)}
                onClick={() =>
                  setFeatures((prev) => toggleValue(prev, item.slug))
                }
              />
            ))}
          </div>
        </FilterCard>

        <FilterCard title={UI_CONFIG.filters.price}>
          <div className="catalog-filter-cursor flex flex-1 flex-col justify-center gap-2.5">
            <Slider
              min={priceBounds.min}
              max={priceBounds.max}
              step={500}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="flex items-baseline justify-between gap-2">
              <Typography
                variant="caption"
                className="text-[12px] text-[#888] md:text-[10px]"
              >
                {`от ${priceRange[0].toLocaleString("ru-RU")} ₽`}
              </Typography>
              <Typography
                variant="caption"
                className="text-[12px] text-[#888] md:text-[10px]"
              >
                {`до ${priceRange[1].toLocaleString("ru-RU")} ₽`}
              </Typography>
            </div>
          </div>
        </FilterCard>

        <FilterCard
          title={UI_CONFIG.filters.viewMode}
          action={
            <div className="flex items-center gap-2">
              <Typography
                variant="caption"
                className="text-[12px] text-[#888] md:text-[10px]"
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
              />
            </div>
          }
        >
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className="catalog-filter-cursor relative mt-0.5 h-[120px] w-full overflow-hidden rounded-lg bg-stone-200 transition-opacity hover:opacity-90 md:h-[132px]"
            aria-label={UI_CONFIG.filters.map}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={UI_CONFIG.catalog.mapImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-bottom"
              aria-hidden
            />
          </button>
        </FilterCard>
      </div>

      {viewMode === "map" ? (
        visibleCount === 0 ? (
          <CatalogEmptyState onReset={resetFilters} />
        ) : (
          <>
            <CatalogMap objects={filtered} />
            <div className="h-[15vh] md:h-[17vh]" aria-hidden />
          </>
        )
      ) : (
        <>
          {visibleCount === 0 ? (
            <CatalogEmptyState onReset={resetFilters} />
          ) : null}

          {/*
            SEO: рендерим все объекты всегда (в DOM для краулеров).
            Невидимые — адаптивно скрыты CSS, без удаления из дерева.
          */}
          <div
            className={cn(
              "mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5",
              visibleCount === 0 && "sr-only"
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {objects.map((object) => {
                const isVisible = visibleSlugSet.has(object.slug);

                return (
                  <motion.div
                    key={object.slug}
                    layout
                    initial={cardMotion.initial}
                    animate={
                      isVisible
                        ? cardMotion.animate
                        : { opacity: 0, scale: 0.95 }
                    }
                    exit={cardMotion.exit}
                    transition={cardMotion.transition}
                    className={cn(!isVisible && "hidden")}
                    aria-hidden={!isVisible}
                    data-catalog-visible={isVisible ? "true" : "false"}
                  >
                    <CatalogListingCard object={object} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
