export const APP_LOCALES = ["en", "tr"] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";
export const LOCALE_COOKIE_NAME = "mergen-locale";
export const LOCALE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

const MAX_ACCEPT_LANGUAGE_LENGTH = 512;
const MAX_LANGUAGE_RANGES = 20;
const languageRangePattern = /^(?:\*|[a-z]{2,8}(?:-[a-z0-9]{1,8})*)$/i;
const qualityPattern = /^q=(0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/i;

export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && APP_LOCALES.includes(value as AppLocale);
}

function mapLanguageRange(range: string): AppLocale | null {
  const normalized = range.toLowerCase();

  if (normalized === "tr" || normalized.startsWith("tr-")) {
    return "tr";
  }

  if (normalized === "en" || normalized.startsWith("en-") || normalized === "*") {
    return "en";
  }

  return null;
}

export function localeFromAcceptLanguage(headerValue: string | null | undefined): AppLocale {
  if (!headerValue || headerValue.length > MAX_ACCEPT_LANGUAGE_LENGTH) {
    return DEFAULT_LOCALE;
  }

  const ranges = headerValue.split(",");
  if (ranges.length > MAX_LANGUAGE_RANGES) {
    return DEFAULT_LOCALE;
  }

  const candidates: Array<{ locale: AppLocale; quality: number; index: number }> = [];

  ranges.forEach((rawRange, index) => {
    const parts = rawRange.split(";").map((part) => part.trim());
    const range = parts.shift();

    if (!range || !languageRangePattern.test(range)) {
      return;
    }

    let quality = 1;
    if (parts.length > 1) {
      return;
    }

    if (parts.length === 1) {
      if (!qualityPattern.test(parts[0])) {
        return;
      }
      quality = Number(parts[0].slice(2));
    }

    if (quality === 0) {
      return;
    }

    const locale = mapLanguageRange(range);
    if (locale) {
      candidates.push({ locale, quality, index });
    }
  });

  candidates.sort((left, right) => right.quality - left.quality || left.index - right.index);
  return candidates[0]?.locale ?? DEFAULT_LOCALE;
}

export function resolveAppLocale(
  cookieValue: string | null | undefined,
  acceptLanguage: string | null | undefined,
): AppLocale {
  return isAppLocale(cookieValue) ? cookieValue : localeFromAcceptLanguage(acceptLanguage);
}

export function serializeLocaleCookie(locale: AppLocale, production: boolean): string {
  const secure = production ? "; Secure" : "";
  return `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}
