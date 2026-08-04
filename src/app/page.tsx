import type { Metadata } from "next";

import { HomeFeed } from "@/components/home-feed";
import { createLocalizedMetadata, getRequestLocale } from "@/modules/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedMetadata(await getRequestLocale(), {
    canonicalPath: "/",
    titleKey: "nav.home",
    descriptionKey: "home.description",
  });
}

export default function HomePage() {
  return <HomeFeed />;
}
