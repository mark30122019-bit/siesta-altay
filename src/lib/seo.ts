import {
  SITE_SEO,
  SITE_URL,
  absoluteAssetUrl,
  absoluteUrl,
} from "@/config/site";
import { formatObjectPrice } from "@/lib/object-price";
import type { BaseObject } from "@/types";

type JsonLd = Record<string, unknown>;

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_SEO.brandName,
    url: `${SITE_URL}/`,
    description: SITE_SEO.description,
    inLanguage: "ru-RU",
    publisher: {
      "@type": "Organization",
      name: SITE_SEO.companyName,
      url: `${SITE_URL}/`,
    },
  };
}

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_SEO.companyName,
    alternateName: SITE_SEO.brandName,
    url: `${SITE_URL}/`,
    logo: absoluteAssetUrl("/icon"),
  };
}

export function lodgingJsonLd(object: BaseObject): JsonLd {
  const image =
    object.seo.og_image ||
    object.tour.preview ||
    object.photos[0]?.src ||
    SITE_SEO.ogImage;

  const priceRange = formatObjectPrice(object);
  const coords = object.location.coords;

  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: object.name,
    description: object.seo.description,
    url: absoluteUrl(`/base/${object.slug}`),
    image: absoluteAssetUrl(image),
    address: {
      "@type": "PostalAddress",
      addressLocality:
        object.location.settlement || object.location.district || undefined,
      addressRegion:
        object.location.region || object.location.district || undefined,
      addressCountry: "RU",
    },
    ...(coords
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: coords[0],
            longitude: coords[1],
          },
        }
      : {}),
    ...(priceRange ? { priceRange } : {}),
  };
}
