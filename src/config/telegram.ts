/**
 * Базовый URL Vercel API для заявок (без пути).
 * Пример: https://siesta-altay-booking-api.vercel.app
 * Клиент дергает `${BOOKING_API_URL}/api/booking`
 */
export const BOOKING_API_URL =
  process.env.NEXT_PUBLIC_BOOKING_API_URL?.trim().replace(/\/$/, "") ?? "";

export function isBookingApiConfigured() {
  return Boolean(BOOKING_API_URL);
}
