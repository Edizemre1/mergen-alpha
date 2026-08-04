import type { Metadata } from "next";

import { ExploreDirectory } from "@/components/explore-directory";
import { createLocalizedMetadata, getRequestLocale } from "@/modules/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedMetadata(await getRequestLocale(), {
    canonicalPath: "/explore",
    titleKey: "nav.explore",
    descriptionKey: "explore.description",
  });
}

export default function ExplorePage() {
  return <ExploreDirectory />;
}
