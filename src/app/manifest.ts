import type { MetadataRoute } from "next";

import { getDictionary, getRequestLocale } from "@/modules/i18n/server";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);

  return {
    name: dictionary["metadata.manifestName"],
    short_name: dictionary["metadata.manifestShortName"],
    description: dictionary["metadata.description"],
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#090c10",
    theme_color: "#090c10",
    lang: locale,
  };
}
