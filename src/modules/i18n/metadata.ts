import type { Metadata } from "next";

import { getDictionary, type TranslationKey } from "./dictionaries";
import type { AppLocale } from "./locales";

export function createLocalizedMetadata(
  locale: AppLocale,
  titleKey?: TranslationKey,
  descriptionKey?: TranslationKey,
): Metadata {
  const dictionary = getDictionary(locale);
  const siteTitle = dictionary["metadata.title"];
  const title = titleKey ? `${dictionary[titleKey]} | Mergen Alpha` : siteTitle;
  const description = descriptionKey ? dictionary[descriptionKey] : dictionary["metadata.description"];

  return {
    title,
    description,
    applicationName: "Mergen Alpha",
    manifest: "/manifest.webmanifest",
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      alternateLocale: locale === "tr" ? ["en_US"] : ["tr_TR"],
      siteName: "Mergen Alpha",
      title,
      description,
      images: [{ url: "/og.png", width: 1731, height: 909, alt: dictionary["metadata.ogAlt"] }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}
