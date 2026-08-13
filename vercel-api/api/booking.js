/**
 * Vercel Serverless Function — приём заявок → Telegram.
 *
 * Env в Vercel Project Settings (Production + Preview):
 *   TG_BOT_TOKEN      — токен @BotFather
 *   TG_CHAT_ID        — id чата/группы (группа: отрицательный)
 *   ALLOWED_ORIGINS   — опционально, через запятую:
 *     https://mark30122019-bit.github.io,http://localhost:3000
 *
 * localhost / 127.0.0.1 на любом порту разрешены всегда.
 */

const MAX_NAME = 80;
const MAX_PHONE = 32;
const MAX_DATES = 120;
const MAX_OBJECT = 160;
const MAX_URL = 500;

const DEFAULT_ORIGINS = [
  "https://mark30122019-bit.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function clip(value, max) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

function parseAllowedOrigins() {
  const fromEnv = String(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set([...DEFAULT_ORIGINS, ...fromEnv])];
}

function isLocalDevOrigin(origin) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (isLocalDevOrigin(origin)) return true;
  return parseAllowedOrigins().includes(origin);
}

function applyCors(req, res) {
  const origin = req.headers.origin || "";

  if (origin && isOriginAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else if (!origin) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");
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

  const slug = clip(body.objectSlug, 80);
  const pageUrl = clip(body.pageUrl, MAX_URL);
  const objectUrl = slug
    ? `https://mark30122019-bit.github.io/siesta-altay/base/${slug}`
    : pageUrl;

  if (objectUrl) {
    lines.push(`🔗 ${objectUrl}`);
  }

  let domain = "mark30122019-bit.github.io";
  if (pageUrl) {
    try {
      domain = new URL(pageUrl).hostname;
    } catch {
      /* keep default */
    }
  }
  lines.push(`🌐 ${domain}`);

  return lines.join("\n");
}

async function sendTelegram(text) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;

  if (!token || !chatId) {
    return { ok: false, status: 500, error: "Server env not configured" };
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    }
  );

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

module.exports = async function handler(req, res) {
  applyCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const origin = req.headers.origin || "";
  if (!isOriginAllowed(origin)) {
    return res.status(403).json({ ok: false, error: "Origin not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch {
      return res.status(400).json({ ok: false, error: "Invalid JSON" });
    }
  }

  if (!isValidPayload(body)) {
    return res.status(400).json({ ok: false, error: "Invalid payload" });
  }

  try {
    const result = await sendTelegram(buildMessage(body));
    if (!result.ok) {
      return res
        .status(result.status || 502)
        .json({ ok: false, error: result.error || "Telegram error" });
    }
    return res.status(200).json({ ok: true });
  } catch {
    return res
      .status(502)
      .json({ ok: false, error: "Failed to reach Telegram" });
  }
};
