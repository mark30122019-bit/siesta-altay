/** Базовый путь для GitHub Pages (имя репозитория). */
export const SITE_BASE_PATH = "/siesta-altay" as const;

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
