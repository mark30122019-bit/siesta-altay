export type PhoneCountry = {
  iso: string;
  name: string;
  dialCode: string;
  flag: string;
  /** Маска национальной части: # = цифра */
  mask: string;
  maxLength: number;
};

/** Страны, логичные для гостей Алтая / СНГ / популярных направлений. */
export const PHONE_COUNTRIES: PhoneCountry[] = [
  {
    iso: "RU",
    name: "Россия",
    dialCode: "7",
    flag: "🇷🇺",
    mask: "(###) ###-##-##",
    maxLength: 10,
  },
  {
    iso: "KZ",
    name: "Казахстан",
    dialCode: "7",
    flag: "🇰🇿",
    mask: "(###) ###-##-##",
    maxLength: 10,
  },
  {
    iso: "BY",
    name: "Беларусь",
    dialCode: "375",
    flag: "🇧🇾",
    mask: "## ###-##-##",
    maxLength: 9,
  },
  {
    iso: "KG",
    name: "Кыргызстан",
    dialCode: "996",
    flag: "🇰🇬",
    mask: "### ###-###",
    maxLength: 9,
  },
  {
    iso: "UZ",
    name: "Узбекистан",
    dialCode: "998",
    flag: "🇺🇿",
    mask: "## ###-##-##",
    maxLength: 9,
  },
  {
    iso: "AM",
    name: "Армения",
    dialCode: "374",
    flag: "🇦🇲",
    mask: "## ######",
    maxLength: 8,
  },
  {
    iso: "GE",
    name: "Грузия",
    dialCode: "995",
    flag: "🇬🇪",
    mask: "### ## ## ##",
    maxLength: 9,
  },
  {
    iso: "UA",
    name: "Украина",
    dialCode: "380",
    flag: "🇺🇦",
    mask: "## ### ## ##",
    maxLength: 9,
  },
  {
    iso: "TR",
    name: "Турция",
    dialCode: "90",
    flag: "🇹🇷",
    mask: "### ### ## ##",
    maxLength: 10,
  },
  {
    iso: "CN",
    name: "Китай",
    dialCode: "86",
    flag: "🇨🇳",
    mask: "### #### ####",
    maxLength: 11,
  },
  {
    iso: "DE",
    name: "Германия",
    dialCode: "49",
    flag: "🇩🇪",
    mask: "#### #######",
    maxLength: 11,
  },
  {
    iso: "US",
    name: "США",
    dialCode: "1",
    flag: "🇺🇸",
    mask: "(###) ###-####",
    maxLength: 10,
  },
];

export const DEFAULT_PHONE_COUNTRY =
  PHONE_COUNTRIES.find((country) => country.iso === "RU") ?? PHONE_COUNTRIES[0];

export function phoneDigitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function formatByMask(digits: string, mask: string) {
  const clean = phoneDigitsOnly(digits);
  let digitIndex = 0;
  let result = "";

  for (const char of mask) {
    if (digitIndex >= clean.length) break;
    if (char === "#") {
      result += clean[digitIndex];
      digitIndex += 1;
    } else {
      result += char;
    }
  }

  return result;
}

/** Нормализация национальных цифр с учётом страны (для RU/KZ: 8… → без ведущей 8). */
export function normalizeNationalDigits(
  raw: string,
  country: PhoneCountry
): string {
  let digits = phoneDigitsOnly(raw);

  if (
    (country.iso === "RU" || country.iso === "KZ") &&
    digits.startsWith("8") &&
    digits.length >= 11
  ) {
    digits = digits.slice(1);
  }

  if (
    digits.startsWith(country.dialCode) &&
    digits.length > country.maxLength
  ) {
    digits = digits.slice(country.dialCode.length);
  }

  return digits.slice(0, country.maxLength);
}

export function toE164(nationalDigits: string, country: PhoneCountry) {
  const national = phoneDigitsOnly(nationalDigits).slice(0, country.maxLength);
  if (!national) return "";
  return `+${country.dialCode}${national}`;
}

export function isCompletePhone(
  value: string,
  country: PhoneCountry = DEFAULT_PHONE_COUNTRY
) {
  const digits = phoneDigitsOnly(value);
  const expected = country.dialCode.length + country.maxLength;
  if (digits.length !== expected) return false;
  return digits.startsWith(country.dialCode);
}

/** Проверка полного E.164 с автоопределением страны по коду. */
export function isCompletePhoneValue(value: string) {
  const country = detectCountryFromE164(value);
  if (isCompletePhone(value, country)) return true;

  // Коллизия +7: Россия / Казахстан — одинаковая длина
  if (phoneDigitsOnly(value).startsWith("7") && phoneDigitsOnly(value).length === 11) {
    return true;
  }

  return false;
}

export function detectCountryFromE164(value: string): PhoneCountry {
  const digits = phoneDigitsOnly(value);
  if (!digits) return DEFAULT_PHONE_COUNTRY;

  const sorted = [...PHONE_COUNTRIES].sort(
    (a, b) => b.dialCode.length - a.dialCode.length
  );

  for (const country of sorted) {
    if (!digits.startsWith(country.dialCode)) continue;
    const national = digits.slice(country.dialCode.length);
    if (national.length <= country.maxLength) {
      // При коллизии +7 предпочитаем RU, если не выбран явно KZ
      if (country.dialCode === "7" && country.iso === "KZ") continue;
      return country;
    }
  }

  return DEFAULT_PHONE_COUNTRY;
}

export function nationalFromE164(value: string, country: PhoneCountry) {
  const digits = phoneDigitsOnly(value);
  if (digits.startsWith(country.dialCode)) {
    return digits.slice(country.dialCode.length).slice(0, country.maxLength);
  }
  return normalizeNationalDigits(digits, country);
}
