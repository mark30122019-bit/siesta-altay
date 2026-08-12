# Алтай изнутри

Агрегатор баз отдыха на Алтае — статический сайт на Next.js 16.  
Продакшен: **[mark30122019-bit.github.io/siesta-altay](https://mark30122019-bit.github.io/siesta-altay/)**

Проект ООО «Сиеста Центр»: каталог объектов, карточки баз с 3D-турами, фильтры, карта Яндекс.Карт.

---

## Стек

- **Next.js 16** (App Router, `output: "export"`)
- **React 19**, TypeScript, Tailwind CSS 4
- **Framer Motion** — анимации каталога
- **GitHub Actions** → GitHub Pages
- **Яндекс.Карты** — режим «Карта» в каталоге

---

## Быстрый старт

```bash
npm ci
cp .env.local.example .env.local   # и заполните ключ карт
npm run dev
```

Откройте [http://localhost:3000/siesta-altay](http://localhost:3000/siesta-altay) — в dev Next.js сам учитывает `basePath`.

### Переменные окружения

Создайте `.env.local` в корне:

```env
NEXT_PUBLIC_YANDEX_MAPS_API_KEY=ваш_ключ
```

Без ключа карта в каталоге покажет сообщение об ошибке; остальной сайт работает.

### Локальный preview статики (как на GitHub Pages)

```bash
npm run preview
```

Откройте **http://localhost:3000/siesta-altay/** — preview-сервер эмулирует `basePath`.

---

## Деплой на GitHub Pages

Сборка и публикация — workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) при push в `master`.  
Собранный сайт из `out/` пушится в ветку **`gh-pages`** (не в `master`, где лежит README).

### Настройка Pages (один раз)

1. Репозиторий → **Settings → Pages**
2. **Build and deployment → Source** → **Deploy from a branch**
3. **Branch** → **`gh-pages`** → **`/ (root)`** → Save
4. Поле **Custom domain** — пустое, если домен не куплен

### Если вместо сайта показывается README

Значит Pages смотрит на ветку **`master`**, а не **`gh-pages`**.  
Переключите branch на **`gh-pages`** (см. выше) и дождитесь завершения workflow **Deploy Next.js to GitHub Pages**.

Проверьте также, что последний run workflow **зелёный** (Actions → Deploy Next.js to GitHub Pages).

### Переменная для карты в CI

В **Settings → Secrets and variables → Actions → Variables** добавьте:

| Variable | Значение |
|----------|----------|
| `NEXT_PUBLIC_YANDEX_MAPS_API_KEY` | ключ API Яндекс.Карт |

Переменная прокидывается в шаг `Build with Next.js` — при статическом экспорте она должна быть доступна **на этапе сборки**.

---

## Структура проекта

```
src/
  app/              # страницы (App Router)
  components/       # UI, home, catalog, base
  config/           # global.ts — данные баз, uiConfig, site.ts — basePath
  lib/              # утилиты, фильтры каталога, загрузка карт
public/media/       # фото баз (копируются в out/)
scripts/            # preview-server.mjs — локальный preview с basePath
```

### Важно про пути

- `basePath`: `/siesta-altay` — задан в [`src/config/site.ts`](src/config/site.ts) и [`next.config.ts`](next.config.ts)
- Статика из `public/` в JSX — через [`assetPath()`](src/config/site.ts), иначе на GitHub Pages картинки не откроются
- `next/image` для импортированных ассетов подхватывает `basePath` автоматически

---

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | dev-сервер |
| `npm run build` | статический экспорт в `out/` |
| `npm run preview` | build + локальный preview |
| `npm run lint` | ESLint |

---

## Лицензия

Частный проект. © ООО «Сиеста Центр».
