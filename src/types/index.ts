export interface LocationConfig {
    region: string;
    district: string;
    settlement: string;
    coords: [number, number];
    distance_gorno_altaysk_km: number;
    distance_novosibirsk_km: number;
    road: string;
    winter_access: boolean;
}

export interface TourConfig {
    url: string;
    preview: string;
    scenes_count: number;
}

export interface PhotoConfig {
    src: string;
    alt: string;
    caption: string;
}

export interface PriceConfig {
    from: number;
    unit: string;
    included: string[];
    extra: string[];
    note: string;
    high_season: string[];
}

export interface SuitabilityItem {
    fit: 'high' | 'medium' | 'low';
    note: string;
}

// 1. Тип для блока позиционирования «ПОЧЕМУ СИЕСТА?»
export interface ManifestConfig {
    title: string;
    subtitle: string;
    description: string;
    features: string[];
}

// 2. Тип для баннера комплексного тура «Экспедиция Сиеста»
export interface PromoTourConfig {
    title: string;
    badge: string;
    description: string;
    image: string;
}

// 3. Тип для карточки отзыва в футере
export interface TestimonialItem {
    quote: string;
    rating: number; // Количество звезд (например, 5)
    baseName: string; // Название базы, где отдыхали
}

// 4. Расширенный интерфейс главного конфигурационного файла сайта
export interface SiteConfig {
    companyName: string;
    brandName: string;
    commissionRate: string;
    labels: {
        forWhom: string;
        district: string;
        features: string;
        notSuitable: string;
    };
    manifest: ManifestConfig;
    promoTour: PromoTourConfig;
    testimonials: TestimonialItem[];
    filters: {
        forWhom: { label: string; slug: string }[];
        districts: { label: string; slug: string }[];
        features: { label: string; slug: string }[];
    };
    objects: BaseObject[];
}


export interface BaseObject {
    slug: string;
    name: string;
    type: string;
    verification: 'shot' | 'none';
    verification_date: string;
    consent: { signed: boolean; date: string };
    location: LocationConfig;
    tour: TourConfig;
    photos: PhotoConfig[];
    price: PriceConfig;
    capacity: { min: number; max: number; units_count: number };
    amenities: {
        banya: boolean; pool: boolean; wifi: boolean; kitchen: boolean;
        heating: boolean; parking: boolean; waterfront: boolean;
        food: string; pets: boolean; year_round: boolean;
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
    booking: { min_nights: number; min_nights_high_season: number; prepayment: string };
    seo: { title: string; description: string; og_image: string };
    status: 'draft' | 'published';
    updated_at: string;
}


