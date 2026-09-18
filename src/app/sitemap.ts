import type { MetadataRoute } from "next";

import { GLOBAL_CONFIG } from "@/config/global";
import { absoluteUrl } from "@/config/site";
import { isObjectListed } from "@/lib/object-flags";
import {
  isObjectListedForEvents,
  isObjectListedForWeddings,
} from "@/lib/object-events";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const published = GLOBAL_CONFIG.objects.filter(isObjectListed);
  const eventsListed = GLOBAL_CONFIG.objects.filter(isObjectListedForEvents);
  const weddingsListed = GLOBAL_CONFIG.objects.filter(isObjectListedForWeddings);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/catalog"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/corporate"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/weddings"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/politika"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const baseRoutes: MetadataRoute.Sitemap = published.map((object) => ({
    url: absoluteUrl(`/base/${object.slug}`),
    lastModified: object.updated_at
      ? new Date(object.updated_at)
      : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const eventRoutes: MetadataRoute.Sitemap = eventsListed.map((object) => ({
    url: absoluteUrl(`/events/${object.slug}`),
    lastModified: object.updated_at
      ? new Date(object.updated_at)
      : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const weddingRoutes: MetadataRoute.Sitemap = weddingsListed.map((object) => ({
    url: absoluteUrl(`/weddings/${object.slug}`),
    lastModified: object.updated_at
      ? new Date(object.updated_at)
      : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...baseRoutes, ...eventRoutes, ...weddingRoutes];
}
