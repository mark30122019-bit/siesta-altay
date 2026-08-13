/** Продакшен на GitHub Pages (без кастомного домена). */
export const SITE_ORIGIN = "https://mark30122019-bit.github.io" as const;

/** Базовый путь — имя репозитория. */
export const SITE_BASE_PATH = "/siesta-altay" as const;

/** Полный URL сайта с basePath. */
export const SITE_URL = `${SITE_ORIGIN}${SITE_BASE_PATH}` as const;

export const SITE_SEO = {
  brandName: "Алтай изнутри",
  companyName: "ООО «Сиеста Центр»",
  titleDefault:
    "Алтай изнутри — базы отдыха на Алтае с честными 3D-турами",
  titleTemplate: "%s | Алтай изнутри",
  description:
    "Подбор баз отдыха на Алтае от ООО «Сиеста Центр»: честные обзоры, 3D-туры изнутри, фильтры по району и удобствам. Бронирование без рекламной воды.",
  keywords: [
    "базы отдыха Алтай",
    "отдых на Алтае",
    "глэмпинг Алтай",
    "усадьбы Алтай",
    "3D-тур база отдыха",
    "Чемал",
    "Сиеста Центр",
    "Алтай изнутри",
  ],
  locale: "ru_RU",
  ogImage: "/media/hero/home.webp",
} as const;

/** Абсолютный URL страницы с учётом basePath. */
export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${normalized}`;
}

/** Абсолютный URL статики из public/ с учётом basePath. */
export function assetPath(path: string): string {
  if (!path || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.startsWith(SITE_BASE_PATH)) {
    return normalized;
  }

  return `${SITE_BASE_PATH}${normalized}`;
}

/** Полный https-URL ассета для Open Graph / JSON-LD. */
export function absoluteAssetUrl(path: string): string {
  if (!path) return absoluteUrl(SITE_SEO.ogImage);
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_ORIGIN}${assetPath(path)}`;
}
