import type { Metadata } from "next";

import { BookmarksView } from "@/components/bookmarks-view";
import { createLocalizedMetadata, getRequestLocale } from "@/modules/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return createLocalizedMetadata(await getRequestLocale(), {
    canonicalPath: "/bookmarks",
    titleKey: "bookmarks.title",
    descriptionKey: "bookmarks.description",
  });
}

export default function BookmarksPage() {
  return <BookmarksView />;
}
