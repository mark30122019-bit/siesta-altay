export interface LocationConfig {
  region: string | null;
  district: string | null;
  settlement: string | null;
  coords: [number, number] | null;
  distance_gorno_altaysk_km: number | null;
  distance_novosibirsk_km: number | null;
  road: string | null;
  winter_access: boolean | null;
}

export interface TourConfig {
  url: string | null;
  preview: string | null;
  scenes_count: number | null;
  features?: string;
}

export interface PhotoConfig {
  src: string;
  alt: string;
  caption: string;
}

/** Цена как у заказчика: на витрину только если publish === true и from — число. */
export interface PriceConfig {
  from: number | null;
  unit: string;
  included: string[];
  extra: string[];
  note: string;
  high_season: string[];
  publish?: boolean;
  _reference_only?: {
    from?: number;
    source?: string;
    status?: string;
    tiers?: {
      name: string;
      from: number;
      guests?: number;
      area_m2?: string;
    }[];
  };
}

export interface SuitabilityItem {
  /** true — подходит, false — нет, null — не задано. */
  fit: boolean | null;
  note: string;
}

export interface ManifestConfig {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
}

export interface PromoTourConfig {
  title: string;
  badge: string;
  description: string;
  image: string;
}

export interface TestimonialItem {
  quote: string;
  rating: number;
  baseName: string;
}

export interface SiteConfig {
  companyName: string;
  brandName: string;
  phone: string;
  commissionRate: string;
  manifest: ManifestConfig;
  promoTour: PromoTourConfig;
  testimonials: TestimonialItem[];
  filters: {
    forWhom: { label: string; slug: string }[];
    regions: { label: string; slug: string }[];
    districts: { label: string; slug: string; region: string }[];
    features: { label: string; slug: string }[];
  };
  objects: BaseObject[];
}

export interface BaseObject {
  slug: string;
  name: string;
  type: string;
  verification: "shot" | "none";
  verification_date: string | null;
  consent: { signed: boolean; date: string | null };
  location: LocationConfig;
  tour: TourConfig;
  photos: PhotoConfig[];
  price?: PriceConfig;
  capacity: {
    min: number | null;
    max: number | null;
    units_count: number | null;
  };
  amenities: {
    banya: boolean | null;
    pool: boolean | null;
    wifi: boolean | null;
    kitchen: boolean | null;
    heating: boolean | null;
    parking: boolean | null;
    waterfront: boolean | null;
    food: boolean | string | null;
    pets: boolean | null;
    year_round: boolean | null;
  };
  suitability: {
    family_kids: SuitabilityItem;
    couples: SuitabilityItem;
    company: SuitabilityItem;
    corporate: SuitabilityItem;
  };
  author: {
    verdict: string;
    good_for: string[];
    not_for: string[];
    honest_note: string;
  };
  booking: {
    min_nights: number | null;
    min_nights_high_season: number | null;
    prepayment: string | null;
    checkin?: string | null;
    checkout?: string | null;
  };
  seo: {
    title: string;
    description: string;
    og_image: string | null;
  };
  /** draft — скрыт; ready_for_review / published — на витрине (пока сайт в noindex). */
  status: "draft" | "published" | "ready_for_review";
  updated_at: string;
}
