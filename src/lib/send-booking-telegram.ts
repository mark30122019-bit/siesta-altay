import { BOOKING_API_URL, isBookingApiConfigured } from "@/config/telegram";

export type BookingTelegramPayload = {
  name: string;
  phone: string;
  dates: string;
  objectName?: string;
  objectSlug?: string;
  pageUrl?: string;
};

export type SendBookingResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Отправка заявки через Cloudflare Worker → Telegram.
 * Токен бота на клиенте не используется.
 */
export async function sendBookingToTelegram(
  payload: BookingTelegramPayload
): Promise<SendBookingResult> {
  if (!isBookingApiConfigured()) {
    return {
      ok: false,
      error: "Не задан NEXT_PUBLIC_BOOKING_API_URL",
    };
  }

  try {
    const response = await fetch(`${BOOKING_API_URL}/booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
    };

    if (!response.ok || !data.ok) {
      return {
        ok: false,
        error: data.error || `Booking API HTTP ${response.status}`,
      };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Не удалось связаться с сервером заявок" };
  }
}
