import type { Metadata } from "next";

import { getDictionary, type TranslationKey } from "./dictionaries";
import type { AppLocale } from "./locales";

export const PUBLIC_SITE_ORIGIN = "https://alpha.mergen.finance";

export type PublicCanonicalPath =
  | "/"
  | "/bookmarks"
  | "/explore"
  | "/notifications"
  | "/privacy"
  | "/profile"
  | "/research"
  | "/support"
  | "/terms"
  | `/analysts/${string}`
  | `/research/${string}`;

interface LocalizedMetadataOptions {
  readonly canonicalPath: PublicCanonicalPath;
  readonly titleKey?: TranslationKey;
  readonly descriptionKey?: TranslationKey;
  readonly authoredTitle?: string;
  readonly authoredDescription?: string;
}

function assertCanonicalPath(canonicalPath: PublicCanonicalPath): void {
  if (
    !canonicalPath.startsWith("/") ||
    canonicalPath.startsWith("//") ||
    /[?#]/.test(canonicalPath) ||
    /^\/(?:en|tr)(?:\/|$)/.test(canonicalPath)
  ) {
    throw new Error(`Invalid public canonical path: ${canonicalPath}`);
  }
}

export function createLocalizedMetadata(
  locale: AppLocale,
  options: LocalizedMetadataOptions,
): Metadata {
  assertCanonicalPath(options.canonicalPath);
  const dictionary = getDictionary(locale);
  const siteTitle = dictionary["metadata.title"];
  const pageTitle = options.authoredTitle ?? (options.titleKey ? dictionary[options.titleKey] : undefined);
  const title = pageTitle ? `${pageTitle} | Mergen Alpha` : siteTitle;
  const description =
    options.authoredDescription ??
    (options.descriptionKey ? dictionary[options.descriptionKey] : dictionary["metadata.description"]);

  return {
    metadataBase: new URL(PUBLIC_SITE_ORIGIN),
    title,
    description,
    applicationName: "Mergen Alpha",
    manifest: "/manifest.webmanifest",
    robots: { index: true, follow: true },
    alternates: { canonical: options.canonicalPath },
    openGraph: {
      type: "website",
      url: options.canonicalPath,
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
