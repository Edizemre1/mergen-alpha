import type { AppLocale } from "./locales";

const localeTags: Record<AppLocale, string> = {
  en: "en-US",
  tr: "tr-TR",
};

export function formatUtcDate(value: string, locale: AppLocale): string {
  return new Intl.DateTimeFormat(localeTags[locale], {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function interpolate(
  template: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key: string) =>
    Object.hasOwn(values, key) ? String(values[key]) : match,
  );
}
