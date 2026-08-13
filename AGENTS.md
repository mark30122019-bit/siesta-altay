<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Алтай изнутри — правила для агента

## О проекте

Статический сайт-агрегатор баз отдыха на Алтае (Next.js 16, App Router, `output: "export"`).  
Продакшен: GitHub Pages → `https://mark30122019-bit.github.io/siesta-altay/`  
Ветка деплоя: **`master`**.

Язык интерфейса и контента — **русский**. Не подключать внешние CDN, Google Fonts, Lucide и т.п. — иконки локальные (`src/components/ui/icon.tsx`).

---

## GitHub Pages и basePath

- `SITE_BASE_PATH = "/siesta-altay"` — единый источник в `src/config/site.ts`, дублируется в `next.config.ts`
- Любые пути к файлам из `public/` в `<img src="...">` **обязательно** через `assetPath()` из `@/config/site`
- `next/image` + static import из `public/` — basePath подхватывается автоматически
- `Link` и `useRouter` — относительные пути (`/catalog`, `/base/slug`), Next добавляет basePath сам
- Локальный preview статики: `npm run preview` → `scripts/preview-server.mjs` → URL с `/siesta-altay/`
- CI: `.github/workflows/deploy.yml` — build → push `out/` в ветку **`gh-pages`**
- **Pages Source:** Deploy from branch → **`gh-pages`** / root (не `master` — там README)
- SEO: `src/app/sitemap.ts`, `src/app/robots.ts`, metadata/OG в layout и страницах, JSON-LD в `src/lib/seo.ts`

Не добавлять `CNAME` и не убирать `basePath`, пока сайт на бесплатном поддомене `github.io/siesta-altay`.

---

## Данные и конфигурация

| Файл | Назначение |
|------|------------|
| `src/config/global.ts` | Данные баз, фото, туры, промо |
| `src/config/uiConfig.ts` | Тексты UI, подписи, slug'и на главной |
| `src/config/site.ts` | `SITE_BASE_PATH`, `assetPath()` |
| `src/config/maps.ts` | `YANDEX_MAPS_API_KEY` из env |
| `src/types/index.ts` | TypeScript-типы объектов |

Новые базы — в `global.ts` + `generateStaticParams` подхватит slug из опубликованных объектов.

---

## Ключевые компоненты

- **Главная**: `src/components/home/*`, hero через `next/image`
- **Каталог**: `catalog-canvas.tsx` — фильтры, URL-state (`catalog-filter-state.ts`), карта/список
- **Карта**: `catalog-map.tsx` — Яндекс.Карты, overlay-карточка без `surface-card-interactive` (без scale hover)
- **Страница базы**: `base-page-canvas.tsx`, 3D — `tour-iframe.tsx` со skeleton
- **Chrome**: `site-header.tsx` (client, hide on scroll), `site-footer.tsx`

---

## Стили и UX

- Design tokens и поверхности — `src/app/globals.css` (`.surface-card`, `.surface-glass`, `.btn-tactile`, `.shimmer`)
- Карточки в списке — `surface-card-interactive` (лёгкий scale на hover)
- Карточка на карте — **без** `surface-card-interactive`; zoom только у фото (`group-hover:scale-[1.04]`)
- Не ломать существующие отступы `md:px-[15vw]` / `md:px-[10vw]` на desktop без запроса

---

## Ограничения static export

- Нет Server Actions, API routes, ISR, `next start` в проде
- `images.unoptimized: true` в `next.config.ts`
- Env `NEXT_PUBLIC_*` — только на build-time; для CI прокидывать в `deploy.yml`
- Не коммитить `.env.local`, `.next/`, `out/`

---

## Перед изменениями

1. Прочитать соседний код — совпадать со стилем и паттернами
2. Минимальный diff — не рефакторить без запроса
3. После правок путей/карт — проверить `npm run build` и пути в `out/index.html`
4. Коммиты — только по явной просьбе пользователя
