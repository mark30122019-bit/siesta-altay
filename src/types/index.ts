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

/** Площадка под мероприятие: вместимость по форматам рассадки. */
export interface EventsVenue {
  name: string;
  type: string;
  indoor: boolean | null;
  area_m2: number | null;
  capacity: {
    theatre: number | null;
    banquet: number | null;
    buffet: number | null;
    classroom: number | null;
  };
  heated: boolean | null;
  note: string;
}

/** B2B-блок: корпоративы / свадьбы. Пустые поля — null / []. */
export interface EventsConfig {
  suitable: boolean | null;
  buyout: {
    available: boolean | null;
    min_guests: number | null;
    min_nights: number | null;
    note: string;
  };
  sleeping: {
    beds_total: number | null;
    beds_single_occupancy: number | null;
    note: string;
  };
  venues: EventsVenue[];
  catering: {
    own_kitchen: boolean | null;
    banquet_menu: boolean | null;
    external_catering_allowed: boolean | null;
    note: string;
  };
  equipment: {
    projector: boolean | null;
    screen: boolean | null;
    sound: boolean | null;
    microphones: boolean | null;
    stage: boolean | null;
    outdoor_power: boolean | null;
    wifi_for_conference: boolean | null;
    note: string;
  };
  logistics: {
    bus_access: boolean | null;
    bus_turnaround: boolean | null;
    parking_cars: number | null;
    road_quality: string | null;
    from_novosibirsk_hours: number | null;
    note: string;
  };
  season: {
    year_round: boolean | null;
    winter_events: boolean | null;
    heated_venues: boolean | null;
  };
  wedding: {
    ceremony_spot: boolean | null;
    ceremony_rain_plan: boolean | null;
    bride_room: boolean | null;
    noise_curfew: string | null;
    external_vendors_allowed: boolean | null;
    photo_spots: string;
    exclusive_date: boolean | null;
  };
  legal: {
    works_with_legal_entity: boolean | null;
    cashless: boolean | null;
    vat: boolean | null;
    closing_documents: boolean | null;
  };
  activities: string[];
  contact_manager: boolean | null;
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
  /** Корпоративы / свадьбы. На B2B-витрине только suitable === true. */
  events?: EventsConfig;
}
