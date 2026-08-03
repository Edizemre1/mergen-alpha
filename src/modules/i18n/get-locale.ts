import { cookies, headers } from "next/headers";

import { LOCALE_COOKIE_NAME, resolveAppLocale, type AppLocale } from "./locales";

export async function getRequestLocale(): Promise<AppLocale> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  return resolveAppLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value,
    headerStore.get("accept-language"),
  );
}
