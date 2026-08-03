"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { interpolate, isAppLocale, serializeLocaleCookie, type AppLocale } from "@/modules/i18n";

import { useLocale } from "./locale-provider";

export function LanguageSwitcher() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const [announcement, setAnnouncement] = useState("");

  function selectLocale(nextLocale: AppLocale) {
    if (!isAppLocale(nextLocale) || nextLocale === locale) {
      return;
    }

    const language = t(nextLocale === "tr" ? "locale.tr" : "locale.en");
    // The locale cookie is the single client-side input to the next server render.
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = serializeLocaleCookie(nextLocale, window.location.protocol === "https:");
    setAnnouncement(interpolate(t("locale.changedTo"), { language }));
    startTransition(() => router.refresh());
  }

  return (
    <div className="language-switcher" aria-label={t("locale.label")}>
      {(["en", "tr"] as const).map((option) => {
        const language = t(option === "en" ? "locale.en" : "locale.tr");
        return (
          <button
            className="language-option"
            data-active={locale === option}
            key={option}
            type="button"
            aria-pressed={locale === option}
            aria-label={interpolate(t("locale.switchTo"), { language })}
            onClick={() => selectLocale(option)}
          >
            {option.toUpperCase()}
          </button>
        );
      })}
      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
