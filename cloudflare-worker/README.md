# Cloudflare Worker — заявки → Telegram

Прокси для формы бронирования сайта «Алтай изнутри».  
Токен бота хранится только в секретах Cloudflare, не в GitHub Pages.

## 1. Установка

```bash
cd cloudflare-worker
npx wrangler login
```

## 2. Секреты

```bash
npx wrangler secret put TG_BOT_TOKEN
# вставьте токен от @BotFather

npx wrangler secret put TG_CHAT_ID
# id чата или группы (группа: отрицательный, например -100…)
```

Как узнать `chat_id`: напишите боту, затем откройте  
`https://api.telegram.org/bot<TOKEN>/getUpdates` и найдите `"chat":{"id":...}`.

## 3. CORS (origins)

В `wrangler.toml` → `[vars].ALLOWED_ORIGINS` перечислите домены через запятую:

```
https://mark30122019-bit.github.io,http://localhost:3000
```

## 4. Деплой

```bash
npx wrangler deploy
```

В ответе будет URL вида:

```
https://siesta-altay-booking.<ваш-subdomain>.workers.dev
```

## 5. Сайт

В корне проекта `.env.local`:

```env
NEXT_PUBLIC_BOOKING_API_URL=https://siesta-altay-booking.<subdomain>.workers.dev
```

Для GitHub Actions добавьте **Variable** (не Secret):

`NEXT_PUBLIC_BOOKING_API_URL` = тот же URL.

Секреты `NEXT_PUBLIC_TG_*` больше не нужны — уберите их из клиента.

## 6. Проверка

```bash
curl -X POST "https://siesta-altay-booking.<subdomain>.workers.dev/booking" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d "{\"name\":\"Тест\",\"phone\":\"+79991234567\",\"dates\":\"12 авг — 18 авг 2026\",\"objectName\":\"Усадьба\"}"
```

Ожидается: `{"ok":true}` и сообщение в Telegram.
