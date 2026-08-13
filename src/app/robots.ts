import type { MetadataRoute } from "next";

import { SITE_BASE_PATH, SITE_URL, absoluteUrl } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: `${SITE_BASE_PATH}/`,
        disallow: [
          `${SITE_BASE_PATH}/test-ui`,
          `${SITE_BASE_PATH}/test-typography`,
          `${SITE_BASE_PATH}/spasibo`,
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: absoluteUrl("/"),
  };
}
