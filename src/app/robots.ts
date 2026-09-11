import type { MetadataRoute } from "next";

import { SITE_BASE_PATH } from "@/config/site";

export const dynamic = "force-static";

/** Сайт временно закрыт от индексации (контент до наполнения реальными данными). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: `${SITE_BASE_PATH}/`,
      },
    ],
  };
}
