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
import { assetPath } from "@/config/site";
import {
  buildCatalogHref,
  catalogHrefMatchesSearchParams,
  defaultCatalogFilterState,
  defaultRegionSlugs,
  districtsForRegions,
  isDefaultRegions,
  loadCatalogFilterState,
  objectHasFeatureFlag,
  objectMatchesDistrictFilter,
  parseCatalogSearchParams,
  persistCatalogFilterState,
  pruneDistrictsForRegions,
  usedDistrictFilters,
  usedFeatureFilters,
  type CatalogViewMode,
} from "@/lib/catalog-filter-state";
import { hasObjectPrice } from "@/lib/object-price";
import { isSuitableFit } from "@/lib/object-flags";
import type { BaseObject } from "@/types";
import { cn } from "@/lib/utils";

type ViewMode = CatalogViewMode;

type FilterSnapshot = {
  regions: string[];
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
        "surface-glass catalog-filter-cursor flex flex-col px-3 py-2.5 md:px-3.5 md:py-2.5",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <Typography
          variant="caption"
          className="text-[13px] font-bold tracking-wide text-[#1A241C] md:text-xs"
        >
          {title}
        </Typography>
        {action}
      </div>
      <div className="flex min-h-0 flex-col">{children}</div>
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
        "catalog-filter-cursor text-left font-sans text-[13px] leading-snug transition-all duration-300 md:text-xs",
        active
          ? "scale-[1.02] font-semibold text-[#BC5434]"
          : "text-[#555] hover:scale-[1.01] hover:text-[#1A241C]",
      )}
    >
      {label}
    </button>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="catalog-filter-cursor flex cursor-pointer items-start gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 size-3.5 shrink-0 accent-[#BC5434]"
      />
      <span
        className={cn(
          "font-sans text-[13px] leading-snug md:text-xs",
          checked ? "font-semibold text-[#1A241C]" : "text-[#555]"
        )}
      >
        {label}
      </span>
    </label>
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

function matchesRegion(object: BaseObject, regions: string[]) {
  if (regions.length === 0) return false;
  if (isDefaultRegions(regions)) return true;
  const regionName = object.location.region;
  if (!regionName) return false;
  return regions.some((slug) => {
    const filter = GLOBAL_CONFIG.filters.regions.find((item) => item.slug === slug);
    return filter ? regionName === filter.label : false;
  });
}

function matchesDistrict(object: BaseObject, districts: string[]) {
  if (districts.length === 0) return true;
  return districts.some((slug) => {
    const filter = GLOBAL_CONFIG.filters.districts.find((d) => d.slug === slug);
    if (!filter) return false;
    return objectMatchesDistrictFilter(object, filter);
  });
}

function matchesFeature(object: BaseObject, features: string[]) {
  if (features.length === 0) return true;
  return features.some((slug) => objectHasFeatureFlag(object, slug));
}

function matchesAudience(object: BaseObject, audiences: string[]) {
  if (audiences.length === 0) return true;
  return audiences.some((slug) => {
    if (slug === "with-kids")
      return isSuitableFit(object.suitability.family_kids.fit);
    if (slug === "in-couple")
      return isSuitableFit(object.suitability.couples.fit);
    if (slug === "company")
      return isSuitableFit(object.suitability.company.fit);
    if (slug === "corporate")
      return isSuitableFit(object.suitability.corporate.fit);
    return true;
  });
}

function matchesFilters(
  object: BaseObject,
  filters: FilterSnapshot,
  priceFilterEnabled: boolean
) {
  if (priceFilterEnabled && hasObjectPrice(object)) {
    if (
      object.price.from < filters.priceRange[0] ||
      object.price.from > filters.priceRange[1]
    ) {
      return false;
    }
  }
  if (!matchesAudience(object, filters.audiences)) return false;
  if (!matchesRegion(object, filters.regions)) return false;
  if (!matchesDistrict(object, filters.districts)) return false;
  if (!matchesFeature(object, filters.features)) return false;
  return true;
}

export function CatalogCanvas({ objects }: { objects: BaseObject[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const priceBounds = useMemo(() => {
    const prices = objects
      .filter(hasObjectPrice)
      .map((object) => object.price.from);
    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return {
      min: Math.floor(min / 1000) * 1000,
      max: Math.ceil(max / 1000) * 1000,
    };
  }, [objects]);

  const priceFilterEnabled = priceBounds.max > priceBounds.min;

  const defaultState = useMemo(
    () => defaultCatalogFilterState(priceBounds),
    [priceBounds]
  );

  const parsedFromUrl = useMemo(
    () => parseCatalogSearchParams(searchParams),
    [searchParams]
  );

  const [regions, setRegions] = useState(parsedFromUrl.regions);
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
    regions: parsedFromUrl.regions,
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
      setRegions(parsedFromUrl.regions);
      setAudiences(parsedFromUrl.audiences);
      setDistricts(parsedFromUrl.districts);
      setFeatures(parsedFromUrl.features);
      setViewMode(parsedFromUrl.viewMode);
      setAppliedFilters((prev) => ({
        regions: parsedFromUrl.regions,
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
        regions,
        audiences,
        districts,
        features,
        priceRange: debouncedPriceRange,
      });
    });
  }, [regions, audiences, districts, features, debouncedPriceRange]);

  useEffect(() => {
    if (!priceHydrated) return;

    const href = buildCatalogHref({
      regions,
      audiences,
      districts,
      features,
      viewMode,
    });

    persistCatalogFilterState(
      {
        regions,
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
    regions,
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
    () =>
      objects.filter((object) =>
        matchesFilters(object, appliedFilters, priceFilterEnabled)
      ),
    [objects, appliedFilters, priceFilterEnabled]
  );

  const visibleDistricts = useMemo(() => {
    const usedSlugs = new Set(usedDistrictFilters(objects).map((item) => item.slug));
    return districtsForRegions(regions).filter((item) => usedSlugs.has(item.slug));
  }, [objects, regions]);

  const availableFeatures = useMemo(
    () => usedFeatureFilters(objects),
    [objects]
  );

  const visibleSlugSet = useMemo(
    () => new Set(filtered.map((object) => object.slug)),
    [filtered]
  );

  const visibleCount = filtered.length;

  function toggleRegion(slug: string) {
    setRegions((prev) => {
      const next = toggleValue(prev, slug);
      const usedSlugs = new Set(
        usedDistrictFilters(objects).map((item) => item.slug)
      );
      setDistricts((current) =>
        pruneDistrictsForRegions(current, next).filter((item) =>
          usedSlugs.has(item)
        )
      );
      return next;
    });
  }

  function resetFilters() {
    const nextRegions = defaultRegionSlugs();
    setRegions(nextRegions);
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
        "px-6 pt-8 pb-[15vh] md:px-[10vw] md:pt-10 md:pb-[17vh]",
        viewMode === "map" && "pb-0 md:pb-0",
        isPending && "opacity-95"
      )}
    >
      <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-2 lg:grid-cols-5 lg:gap-2.5">
        <FilterCard title={UI_CONFIG.filters.forWhom}>
          <div className="flex min-h-[80px] flex-wrap content-start gap-1.5">
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


        <FilterCard title={UI_CONFIG.filters.region}>
          <div className="flex min-h-[80px] flex-col gap-3">
            {GLOBAL_CONFIG.filters.regions.map((item) => (
              <FilterCheckbox
                key={item.slug}
                label={item.label}
                checked={regions.includes(item.slug)}
                onChange={() => toggleRegion(item.slug)}
              />
            ))}
          </div>
        </FilterCard>

        <FilterCard title={UI_CONFIG.filters.district}>
          {visibleDistricts.length > 0 ? (
            <div className="grid min-h-[80px] grid-cols-2 content-start gap-x-3 gap-y-2">
              {visibleDistricts.map((item) => (
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
          ) : (
            <Typography
              variant="caption"
              className="text-[12px] text-[#8A8278] md:text-[11px]"
            >
              {UI_CONFIG.catalog.selectRegionHint}
            </Typography>
          )}
        </FilterCard>

        {availableFeatures.length > 0 ? (
          <FilterCard title={UI_CONFIG.filters.features}>
            <div className="grid min-h-[80px] grid-cols-2 content-start gap-x-3 gap-y-2">
              {availableFeatures.map((item) => (
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
        ) : null}

        {priceFilterEnabled ? (
          <FilterCard title={UI_CONFIG.filters.price}>
            <div className="catalog-filter-cursor flex min-h-[80px] flex-col justify-center gap-2">
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
        ) : null}

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
            className="catalog-filter-cursor relative mt-0.5 h-[72px] w-full overflow-hidden rounded-xl bg-linear-to-br from-[#d4cfc4] via-[#c5bfb2] to-[#a8b0a4] transition-all duration-300 hover:opacity-95 hover:shadow-[var(--shadow-card-hover)] md:h-[80px]"
            aria-label={UI_CONFIG.filters.map}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetPath(UI_CONFIG.catalog.mapImage)}
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
