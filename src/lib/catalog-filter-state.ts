import { GLOBAL_CONFIG } from "@/config/global";
import { UI_CONFIG } from "@/config/uiConfig";

export const CATALOG_PATH = UI_CONFIG.routing.catalog.href;
export const CATALOG_RETURN_HREF_KEY = "altai:catalog-return-href";
export const CATALOG_STATE_KEY = "altai:catalog-filter-state";

export type CatalogViewMode = "list" | "map";

export type CatalogFilterState = {
  audiences: string[];
  districts: string[];
  features: string[];
  priceRange: [number, number];
  viewMode: CatalogViewMode;
};

export type CatalogUrlState = Pick<
  CatalogFilterState,
  "audiences" | "districts" | "features" | "viewMode"
>;

type PriceBounds = { min: number; max: number };

const VALID_AUDIENCES = new Set(
  GLOBAL_CONFIG.filters.forWhom.map((item) => item.slug)
);
const VALID_DISTRICTS = new Set(
  GLOBAL_CONFIG.filters.districts.map((item) => item.slug)
);
const VALID_FEATURES = new Set(
  GLOBAL_CONFIG.filters.features.map((item) => item.slug)
);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function parseSlugList(raw: string | null, valid: Set<string>) {
  if (!raw) return [];
  return raw.split(",").filter((slug) => valid.has(slug));
}

function normalizeQuery(searchParams: URLSearchParams) {
  const entries = [...searchParams.entries()].sort(([a], [b]) =>
    a.localeCompare(b)
  );
  return new URLSearchParams(entries).toString();
}

function normalizePriceRange(
  range: [number, number],
  priceBounds: PriceBounds
): [number, number] {
  const min = clamp(range[0], priceBounds.min, priceBounds.max);
  const max = clamp(range[1], priceBounds.min, priceBounds.max);
  return [Math.min(min, max), Math.max(min, max)];
}

export function parseCatalogSearchParams(
  searchParams: URLSearchParams
): CatalogUrlState {
  return {
    audiences: parseSlugList(searchParams.get("audiences"), VALID_AUDIENCES),
    districts: parseSlugList(searchParams.get("districts"), VALID_DISTRICTS),
    features: parseSlugList(searchParams.get("features"), VALID_FEATURES),
    viewMode: searchParams.get("view") === "map" ? "map" : "list",
  };
}

export function buildCatalogHref(state: CatalogUrlState): string {
  const params = new URLSearchParams();

  if (state.audiences.length > 0) {
    params.set("audiences", state.audiences.join(","));
  }
  if (state.districts.length > 0) {
    params.set("districts", state.districts.join(","));
  }
  if (state.features.length > 0) {
    params.set("features", state.features.join(","));
  }
  if (state.viewMode === "map") {
    params.set("view", "map");
  }

  const query = params.toString();
  return query ? `${CATALOG_PATH}?${query}` : CATALOG_PATH;
}

export function catalogHrefMatchesSearchParams(
  href: string,
  searchParams: URLSearchParams
) {
  const query = href.includes("?") ? href.split("?")[1]! : "";
  return normalizeQuery(new URLSearchParams(query)) === normalizeQuery(searchParams);
}

export function persistCatalogFilterState(
  state: CatalogFilterState,
  priceBounds: PriceBounds
) {
  if (typeof window === "undefined") return;

  const normalized: CatalogFilterState = {
    audiences: state.audiences,
    districts: state.districts,
    features: state.features,
    priceRange: normalizePriceRange(state.priceRange, priceBounds),
    viewMode: state.viewMode,
  };

  sessionStorage.setItem(CATALOG_STATE_KEY, JSON.stringify(normalized));
  sessionStorage.setItem(
    CATALOG_RETURN_HREF_KEY,
    buildCatalogHref(normalized)
  );
}

function parseStoredSlugList(
  value: unknown,
  valid: Set<string>
): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (slug): slug is string => typeof slug === "string" && valid.has(slug)
  );
}

export function loadCatalogFilterState(
  priceBounds: PriceBounds
): CatalogFilterState | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(CATALOG_STATE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<CatalogFilterState>;
    if (!Array.isArray(parsed.priceRange) || parsed.priceRange.length !== 2) {
      return null;
    }

    return {
      audiences: parseStoredSlugList(parsed.audiences, VALID_AUDIENCES),
      districts: parseStoredSlugList(parsed.districts, VALID_DISTRICTS),
      features: parseStoredSlugList(parsed.features, VALID_FEATURES),
      priceRange: normalizePriceRange(
        [Number(parsed.priceRange[0]), Number(parsed.priceRange[1])],
        priceBounds
      ),
      viewMode: parsed.viewMode === "map" ? "map" : "list",
    };
  } catch {
    return null;
  }
}

export function readCatalogReturnHref() {
  if (typeof window === "undefined") return CATALOG_PATH;
  const stored = sessionStorage.getItem(CATALOG_RETURN_HREF_KEY);
  if (stored?.startsWith(CATALOG_PATH)) return stored;
  return CATALOG_PATH;
}

export function defaultCatalogFilterState(
  priceBounds: PriceBounds
): CatalogFilterState {
  return {
    audiences: [],
    districts: [],
    features: [],
    priceRange: [priceBounds.min, priceBounds.max],
    viewMode: "list",
  };
}
