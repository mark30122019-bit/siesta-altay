# Vercel API — заявки → Telegram

Отдельный serverless endpoint для сайта на GitHub Pages  
(у static export нет своих API routes).

## 1. Деплой

Из папки `vercel-api`:

```bash
cd vercel-api
npx vercel login
npx vercel
```

Для продакшена:

```bash
npx vercel --prod
```

URL будет вида:

```
https://siesta-altay-booking-api.vercel.app
```

(или ваш team/project URL)

## 2. Env в Vercel

Project → **Settings → Environment Variables**:

| Name | Value | Environments |
|------|--------|----------------|
| `TG_BOT_TOKEN` | токен BotFather | Production, Preview |
| `TG_CHAT_ID` | id чата/группы | Production, Preview |
| `ALLOWED_ORIGINS` | опционально; localhost на любом порту уже разрешён в коде | Production, Preview |

После изменения env / кода сделайте Redeploy (`npx vercel --prod`).

**Не используйте** одноразовый URL вида `https://xxx-xxxxx-username.vercel.app` —
берите стабильный Production Domain из Dashboard проекта.

## 3. Сайт

В корневом `.env.local`:

```env
NEXT_PUBLIC_BOOKING_API_URL=https://siesta-altay-booking-api.vercel.app
```

В GitHub Actions → **Variables**:

`NEXT_PUBLIC_BOOKING_API_URL` = тот же URL (без `/api/booking`).

Перезапустите `npm run dev`.

## 4. Проверка

```bash
curl -X POST "https://ВАШ_ПРОЕКТ.vercel.app/api/booking" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d "{\"name\":\"Тест\",\"phone\":\"+79991234567\",\"dates\":\"12 авг — 18 авг 2026\",\"objectName\":\"Усадьба\"}"
```

Ожидается: `{"ok":true}` и сообщение в Telegram.

## Важно

Токен бота хранится только в Vercel Env, не в бандле GitHub Pages.
