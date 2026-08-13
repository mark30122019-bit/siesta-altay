/**
 * URL Cloudflare Worker для заявок.
 * Пример: https://siesta-altay-booking.xxx.workers.dev
 */
export const BOOKING_API_URL =
  process.env.NEXT_PUBLIC_BOOKING_API_URL?.trim().replace(/\/$/, "") ?? "";

export function isBookingApiConfigured() {
  return Boolean(BOOKING_API_URL);
}
