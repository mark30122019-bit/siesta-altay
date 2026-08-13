import type { MetadataRoute } from "next";

import { GLOBAL_CONFIG } from "@/config/global";
import { absoluteUrl } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const published = GLOBAL_CONFIG.objects.filter(
    (object) => object.status === "published"
  );

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

  return [...staticRoutes, ...baseRoutes];
}
