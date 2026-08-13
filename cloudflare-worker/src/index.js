/**
 * Cloudflare Worker — прокси заявок в Telegram.
 *
 * Секреты (wrangler secret put):
 *   TG_BOT_TOKEN  — токен от @BotFather
 *   TG_CHAT_ID    — id чата / группы (группа: отрицательный)
 *
 * Опционально в wrangler.toml [vars]:
 *   ALLOWED_ORIGINS — через запятую, например:
 *   https://mark30122019-bit.github.io,http://localhost:3000
 */

const MAX_NAME = 80;
const MAX_PHONE = 32;
const MAX_DATES = 120;
const MAX_OBJECT = 160;
const MAX_URL = 500;

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

function parseAllowedOrigins(env) {
  const raw = env.ALLOWED_ORIGINS || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = parseAllowedOrigins(env);
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };

  if (allowed.length === 0) {
    // Если список не задан — разрешаем любой Origin (удобно для первого запуска)
    headers["Access-Control-Allow-Origin"] = origin || "*";
    return headers;
  }

  if (allowed.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  }

  return headers;
}

function clip(value, max) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

function isValidPayload(body) {
  if (!body || typeof body !== "object") return false;
  const name = clip(body.name, MAX_NAME);
  const phone = clip(body.phone, MAX_PHONE);
  const dates = clip(body.dates, MAX_DATES);
  return name.length >= 2 && phone.length >= 5 && dates.length >= 3;
}

function buildMessage(body) {
  const lines = [
    "⚡️ Новая заявка с сайта «Алтай изнутри»",
    "",
    `👤 Имя: ${clip(body.name, MAX_NAME)}`,
    `📞 Телефон: ${clip(body.phone, MAX_PHONE)}`,
    `📅 Даты: ${clip(body.dates, MAX_DATES)}`,
  ];

  if (body.objectName) {
    lines.push(`🏠 Объект: ${clip(body.objectName, MAX_OBJECT)}`);
  }
  if (body.objectSlug) {
    lines.push(`🔗 /base/${clip(body.objectSlug, 80)}`);
  }
  if (body.pageUrl) {
    lines.push(`🌐 ${clip(body.pageUrl, MAX_URL)}`);
  }

  return lines.join("\n");
}

async function sendTelegram(env, text) {
  const token = env.TG_BOT_TOKEN;
  const chatId = env.TG_CHAT_ID;

  if (!token || !chatId) {
    return { ok: false, status: 500, error: "Worker secrets not configured" };
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.ok) {
    return {
      ok: false,
      status: 502,
      error: data.description || `Telegram HTTP ${response.status}`,
    };
  }

  return { ok: true };
}

export default {
  async fetch(request, env) {
    const headers = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, 405, headers);
    }

    const url = new URL(request.url);
    if (url.pathname !== "/" && url.pathname !== "/booking") {
      return json({ ok: false, error: "Not found" }, 404, headers);
    }

    // CORS: если ALLOWED_ORIGINS задан и Origin не в списке — отказ
    const allowed = parseAllowedOrigins(env);
    const origin = request.headers.get("Origin") || "";
    if (allowed.length > 0 && origin && !allowed.includes(origin)) {
      return json({ ok: false, error: "Origin not allowed" }, 403, headers);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON" }, 400, headers);
    }

    if (!isValidPayload(body)) {
      return json({ ok: false, error: "Invalid payload" }, 400, headers);
    }

    try {
      const result = await sendTelegram(env, buildMessage(body));
      if (!result.ok) {
        return json(
          { ok: false, error: result.error || "Telegram error" },
          result.status || 502,
          headers
        );
      }
      return json({ ok: true }, 200, headers);
    } catch (error) {
      return json(
        { ok: false, error: "Worker failed to reach Telegram" },
        502,
        headers
      );
    }
  },
};
